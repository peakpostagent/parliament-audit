# Parliament Audit — Isolated Browser Automation

This directory contains a small Playwright toolkit that runs **independent of** the `claude-browser-mcp` server. It uses its own profile directory at `parliament-audit/.browser-profile/` (git-ignored) so it doesn't conflict with the dev session's browser.

## Why this exists

The `claude-browser-mcp` server's profile directory gets locked by whichever Claude Code session connects first. When two sessions try to use it, the second silently fails with `"Target page, context or browser has been closed"`. This toolkit sidesteps that by maintaining its own browser profile that no other process touches.

## One-time setup

```sh
npx tsx scripts/browser/login.ts
```

A visible Chrome window opens. Sign into X and Bluesky if prompted. The script auto-detects login completion (within 5 minutes) and closes the browser. The session persists.

To log into just one platform:
```sh
npx tsx scripts/browser/login.ts --x
npx tsx scripts/browser/login.ts --bluesky
```

## Then any of these run fully headlessly:

```sh
npx tsx scripts/browser/upload-x-banner.ts                 # uploads docs/banner.png
npx tsx scripts/browser/upload-x-banner.ts --file ./b.png  # custom file
npx tsx scripts/browser/upload-x-banner.ts --headed        # show window for debugging
```

## Architecture

- **`context.ts`** — shared `openBrowser()` helper. All scripts use it.
- **`login.ts`** — interactive login flow (headed). Saves session to `.browser-profile/`.
- **`upload-x-banner.ts`** — automated banner upload (headless after login).
- More scripts can be added (`upload-x-avatar.ts`, `screenshot-profile.ts`, etc.) following the same pattern.

## Comparison to alternatives

| Path | Pro | Con |
|---|---|---|
| **This toolkit** (Playwright direct) | Independent profile, no MCP locks, full control | Have to write each operation as a script |
| `claude-browser-mcp` | Generic tool surface, AI-callable | Profile dir locks across concurrent sessions |
| Old Chrome extension MCP (`mcp__Claude_in_Chrome__*`) | Uses your real Chrome with all logins | `file_upload` is broken on X (CDP "Not allowed") |
| X API v2 OAuth | Most reliable, no browser at all | Requires developer account + ~10 min OAuth setup |

The X API path is still the cleanest long-term. This toolkit is the bridge until those creds are in `.env`.
