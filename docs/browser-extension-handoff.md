# Handoff: Replacement for Claude Chrome Extension

**Date:** 2026-04-18  
**From:** Claude session that just spent ~6 hours scheduling 12 tweets across X and Bluesky for Parliament Audit  
**To:** The team building the replacement web-browser tool / extension

This document captures what worked, what hurt, and what the replacement needs to get right so the cutover is painless. It's organized by impact — fix the top items first.

---

## 0. The single most important behavior change

**Modal-aware element resolution.** When a `[role="dialog"]` or `[aria-modal="true"]` is present in the DOM, `find` and `read_page` must default to searching **inside the topmost dialog**, not the whole page. The most common failure mode all night was X's compose dialog: there are two `<textbox aria-label="Post text">` elements simultaneously — one in the home timeline (background) and one in the open compose modal. `find` would arbitrarily return one or both. Clicking the timeline ref while the modal is open focuses an off-screen textbox; subsequent `type` calls send keystrokes nowhere. Cost me dozens of redundant tool calls.

**Required behavior:** if a modal is open, `find` returns elements scoped to that modal unless the caller explicitly passes `scope: "page"`. If a query matches multiple elements, prefer the one inside the topmost modal/dialog. Same rule for `read_page` default depth.

---

## 1. Tools I actually used (keep all of these)

| Current name | What it does | Notes |
|---|---|---|
| `tabs_context_mcp` / `tabs_create_mcp` | Get/create tabs in the MCP tab group | Keep; the tab-group isolation is correct |
| `navigate` | Go to URL on a tab | Keep |
| `read_page` | A11y tree dump | Keep, but see §0 about scoping |
| `find` | Natural-language → element refs | **The single most valuable tool.** Keep, but make it smarter |
| `computer` (`left_click`, `type`, `screenshot`, `wait`, `scroll`, `key`, `hover`) | Mouse/keyboard/screenshot primitives | Keep all variants |
| `form_input` | Set value on `<select>`, `<input type=date>`, etc. | Keep — this saved me on the schedule form |
| `javascript_tool` | Eval JS in page | Keep as escape hatch |
| `read_console_messages` / `read_network_requests` | Diagnostics | Underused but keep |

The current MCP names are fine. Don't rename them on cutover unless you have to — every renamed tool means a migration.

---

## 2. Concrete bugs / friction points (ranked by pain)

### 2.1 Dual element refs across modal + background (see §0)

### 2.2 `find` is too literal about labels
- Query: `"Day combobox"` → "no element found"  
- Query: `"combobox 23"` (using the literal current value) → returns the right element  

The schedule form has labels like `Day` rendered visually but the accessible name on the combobox is just the current value `23`. `find` should fall back to label-by-association (look for a `<label>` near the combobox, the `aria-labelledby` chain, or the visually-adjacent text).

### 2.3 Refs go stale after sub-modal interactions
After clicking Confirm in the schedule sub-dialog, the parent compose dialog's `Schedule` button got a new ref. I expected the ref system to be stable across same-page mutations. If you can't make refs stable, at least include a `note: refs are invalidated when DOM trees mutate` in the tool description, and make `left_click` retry once with a re-find on stale ref.

### 2.4 `type` races with focus
Pattern that failed repeatedly: `left_click(ref)` → `type(text)`. The click sometimes hadn't fully focused before the type fired, so text went to whatever had focus before. Workarounds I had to use:
- `wait(2)` between click and type (slow, racy)
- Coordinate clicks at the placeholder text (unreliable)
- Re-finding the textbox with `find`, then click-by-ref (most reliable but verbose)

**Fix:** add an atomic `type_into(ref, text)` that does focus + verify-focus + type + verify-text-changed. Bonus: it can recover from a stale ref automatically.

### 2.5 The tab group disappeared mid-session
Got `Tab 1254908630 no longer exists. Call tabs_context_mcp to get current tabs.` after a routine `navigate` followed by a `type`. No warning, no obvious cause. Required `tabs_context_mcp` with `createIfEmpty: true` and starting over with a new tab ID. Should not happen silently — at minimum, surface the cause (tab closed by user? group destroyed? extension reloaded?).

### 2.6 No way to verify a `type` worked
Every single `type` call that mattered required a follow-up `screenshot` to confirm the text actually landed. That doubles the tool-call count on form work. A `get_value(ref)` or built-in verification in `type_into` (above) would 5x my throughput on form-heavy tasks.

### 2.7 Coordinate clicks for focus are unreliable on contenteditable
X's compose textbox is a contenteditable Draft.js div, not a real `<textarea>`. Clicks at coordinates inside it sometimes focus, sometimes don't (probably because of overlapping div layers and pointer-events CSS). Ref-based clicks are noticeably more reliable.

### 2.8 Native messaging breaks for spawned child sessions
**This one cost me an entire previous attempt at posting.** When a scheduled task in the Claude Code harness spawns a fresh child session, that child session inherits ToolSearch but not the live native-messaging connection to the extension. The child sees Chrome tools listed, calls `tabs_context_mcp`, and the call hangs forever — no timeout, no error, just a dead session. All 12 of my originally-scheduled tweet posts failed silently this way before I diagnosed it.

**Required:** either (a) child sessions should re-establish the native messaging connection automatically, or (b) Chrome tool calls in a session without a live connection should fail fast with a clear error like `"Chrome MCP not connected. Run from a session that has the extension paired."`

### 2.9 No "wait until idle"
Used `wait(2)` and `wait(3)` repeatedly as a guess-the-render-time hack. A `wait_for_idle(network_quiet=500ms, animation_idle=true)` primitive would replace all of those with one deterministic call.

---

## 3. What worked great (don't regress)

- **Persistent login session.** This is the killer feature vs. Playwright defaults. I came into the session already logged into `@ParliamentAudit` on X and into `parliamentaudit.bsky.social` cookies were live. Don't lose this on cutover. Use the user's actual Chrome profile (`User Data/Default`) or a persistent profile dir, not a fresh ephemeral context.
- **Accessibility-tree-based find.** Despite the bugs, semantic queries are 10x faster than CSS selectors. Don't switch to a selector-only API.
- **`form_input` on `<select>` and `<input type=date>`.** Setting the date textbox to `"2026-04-20"` directly was way easier than driving the three Day/Month/Year dropdowns separately. Keep the polymorphism — the same tool handles selects, date inputs, checkboxes, etc.
- **`screenshot` returning fast** (~1s typical). Critical for verification loops. Don't regress latency.
- **The ref system in general.** Returning short opaque ref IDs (`ref_68`, `ref_357`) that map back to elements is the right design. Just make them stable across mutations where possible.

---

## 4. Architectural notes from reading the official extension

For reference, the current extension at `fcoeoabgfenejglbffodgkkbkcdhcgfn/1.0.68_0`:

- **Manifest v3.** `debugger`, `nativeMessaging`, `tabs`, `tabGroups`, `scripting`, `webNavigation`, `offscreen` permissions. Replacement should match.
- **Content scripts injected at `document_start` on `<all_urls>`:**
  - `accessibility-tree.js` — this is the engine behind `find` and `read_page`. Worth studying carefully before reimplementing.
  - `agent-visual-indicator.js` — the visible "Claude is controlling this tab" overlay. Keep this; it's a trust signal for the user.
- **Bundled assets in `assets/`** (~11 MB minified). Most of the logic lives there.
- **Native messaging** is how the extension talks to the local Claude/MCP host.
- **Uses CDP via the `debugger` permission** for input dispatch and page control. Same approach Playwright uses internally — fine.

If you fork rather than rewrite, keep `accessibility-tree.js` as-is initially and only modify the modal-scoping logic in §0. That's the highest-value, lowest-risk change.

---

## 5. New tools I'd add

These didn't exist tonight and would have saved hours:

1. **`type_into(ref, text, verify=true)`** — focus + type + verify text changed. Atomic, retries on focus failure.
2. **`get_value(ref)`** — read current value/text content. For verification without a screenshot.
3. **`wait_for_idle({network_ms=500, animation=true, max_ms=10000})`** — deterministic wait for stable page.
4. **`wait_for_element(query, max_ms=5000)`** — `find` with built-in retry-until-present. Replaces the `wait(2); find(...)` pattern.
5. **`find_in_modal(query)`** — convenience: like `find` but auto-scoped to topmost modal. Or just make this the default of `find` (see §0).
6. **`click_and_type(text)`** — combined helper for "click the focused-looking text input and type". For when you don't want to find by ref.

---

## 6. What the cutover should look like

To make the switch painless from this session's perspective:

1. **Same MCP tool names.** Don't break tool calls in flight.
2. **Same ref ID format.** `ref_<n>` opaque strings. Don't change to UUIDs or paths.
3. **Same semantics for `find` queries.** Natural language in, ref + description out.
4. **Same persistent profile.** Cutover should not require re-logging into anything.
5. **Backwards-compatible: leave the old extension installed for one transition session.** If the new one breaks, I can fall back without losing all browser access mid-task.
6. **Pair check tool.** A trivial `ping` tool that returns the extension version and connection status. Lets a new session immediately verify which extension it's talking to.

---

## 7. Acceptance test for the new extension

Run these in order on a logged-in X account; all should pass without manual fallback:

1. Navigate to `https://x.com/compose/post`
2. `find("Post text input in compose dialog")` returns exactly one ref, scoped to the modal
3. `type_into(ref, "Test post — please ignore")` lands the text on first try
4. `find("Schedule post button in compose dialog")` returns the modal's button (not the timeline's)
5. Click it, dialog opens
6. `find("date picker")` returns the `<input type=date>` (not the three separate dropdowns)
7. `form_input(ref, "2026-12-31")` sets the date
8. Confirm → Schedule → tweet appears in scheduled posts
9. Total tool calls under 15. (Tonight, scheduling one tweet took 8-12 calls when things worked, 20+ when they didn't.)

If a session can complete this in 15 calls reliably, the new tool is better than what I had tonight.

---

## 8. Open questions for the team

- Is there appetite for a **`record` mode** that captures my tool calls as a replayable script? Half my scheduled-tweet work could've been a single replay.
- Could the extension expose a **stable element ID** (e.g., a hash of the accessibility properties) that survives DOM re-renders? Would eliminate the "stale ref" issue.
- Is **headed Chromium via Playwright** an option for the host runtime, or are you committed to controlling the user's actual Chrome? (The former is more reproducible; the latter is what gives you the persistent-login magic.)

---

## TL;DR for the engineers

1. **Modal scoping** is the #1 fix. Default `find` to the topmost dialog when one is open.
2. **`type_into` atomic operation** is the #2 fix. Eliminates the click-then-type race that ate my night.
3. **Native messaging in spawned sessions** is the #3 fix. Silent hangs in child sessions are unacceptable.
4. **Don't lose:** persistent profiles, semantic find queries, polymorphic `form_input`, the visual indicator overlay.
5. **Same tool names + same ref format** = painless cutover.

Ping me on next session and I'll re-run the acceptance test in §7.
