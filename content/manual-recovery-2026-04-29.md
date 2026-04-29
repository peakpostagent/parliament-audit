# Manual Recovery — 2026-04-29 PrescribeIT Launch

What broke, what got reposted, what I learned. Written after the recovery sequence finished cleanly.

## What was supposed to happen

4 posts auto-scheduled via Claude Code scheduled tasks for the PrescribeIT $298M article launch:

| Task | Time | Platform | Angle |
|---|---|---|---|
| `prescribeit-x-post-1` | 08:00 ET | X | Vendor IP / AG request |
| `prescribeit-bluesky-post-1` | 08:00 ET | Bluesky | Vendor IP / AG request |
| `prescribeit-x-post-2` | 12:00 ET | X | Adoption failure |
| `prescribeit-bluesky-post-2` | 12:00 ET | Bluesky | Tracking-gap admission |

Plan: Article goes up overnight (committed `94a4ee5`), four scheduled tasks fire at the next two peak windows (8 AM ET morning rush, 12 PM ET lunch peak), ntfy notifications hit Cole's phone for each.

## What actually happened

**Failure #1: scheduled-task permission wall.** Both 08:00 ET tasks dispatched correctly — `lastRunAt` confirms they fired at 12:00:09 UTC. But the spawned task sessions hit a Bash-tool permission prompt and stalled. With nobody at the screen at 04:00 MDT to click "approve," the bash command never executed. The tasks logged as "fired" but neither post went up.

The scheduled-tasks tool warned about this when I created the tasks: *"recommend the user click 'Run now' first to pre-approve the tools it needs — this prevents future runs from pausing on permission prompts."* I didn't pre-approve. The 12:00 ET pair would have hit the same wall, so I disabled them when Cole flagged the missing X post.

**Failure #2: shell-quoting truncated the manual reposts.** When I started manually posting in this session, I passed multi-line strings via `--text "<body>"` flags. Bash kept the quotes intact but Node's `process.argv[i + 1]` only saw the first paragraph of the heredoc-style content. **X #1 went live as just the first sentence + link card** (acceptable but bare). **Bluesky #1 went live with 87 chars of intended 289** — truncated to the first sentence with no link to the full thought.

I caught the Bluesky truncation immediately (the script printed `text length: 87 / 300`), deleted the bad post via the AT Protocol `deletePost`, and added a `--text-file <path>` flag to both posters so multi-line content reads from disk instead of shell argv. From that point on, every post worked correctly.

## Final state

**Article live:** [parliamentaudit.ca/news/prescribeit-298m-axe-the-fax-shutdown](https://parliamentaudit.ca/news/prescribeit-298m-axe-the-fax-shutdown)

**Posts live:**

| Platform | Post | Body length |
|---|---|---|
| X | Vendor IP / AG request | First sentence only (truncated by shell) — left as-is |
| X | Adoption failure (<5% in 10 yrs) | Full body via `--text-file` |
| Bluesky | Vendor IP / AG request | Full 289 chars via `--text-file` (after deleting truncated original) |
| Bluesky | Tracking-gap admission | Full 250 chars via `--text-file` |

**Editorial note on X #1:** the truncated first sentence — *"Ottawa spent more than \$290M on PrescribeIT, the national e-prescribing service shutting down May 29."* — is fact-correct and the attached link card carries the full story. Replacing it would mean deleting + reposting (loses any impressions accumulated) and the second post would land suspiciously close in time to the first. Decided to leave.

## Lessons

### Scheduled tasks need pre-approval
Any scheduled task that calls Bash, browser tools, or anything that prompts for permission must have those approvals stored on the task before unattended runs. The pattern:

1. Create the task with `mcp__scheduled-tasks__create_scheduled_task`
2. **Click "Run now" once** in the Claude Code sidebar — approve every permission it asks for. Approvals get stored on the task and auto-applied to future runs.
3. Then the scheduled fire works unattended.

Tasks that never had a "Run now" pre-approval will silently log `lastRunAt` while their internal session stalls on the permission wall.

### Multi-line shell args are unreliable — use `--text-file` instead
Both `scripts/browser/post-one-x.ts` and `scripts/post-arbitrary-bluesky.ts` now accept:

```
--text-file content/social-drafts/<filename>.txt
```

For any multi-line post body, write to a file in `content/social-drafts/` and pass the path. The shell never sees the body content.

For one-line posts, the inline `--text "<body>"` flag still works.

This is now documented in both scripts' header comments.

### Document the auth-friction tradeoff up front
Manual posting is more reliable than scheduled posting because the human session has all permissions pre-approved by being attended. For high-stakes launches (a new article, a contested story) the manual path is less risky than scheduling. Schedule for cadence; post manually for launches.

## Files committed in this recovery

- `scripts/post-arbitrary-bluesky.ts` — added `--text-file` flag
- `scripts/browser/post-one-x.ts` — added `--text-file` flag
- `content/social-drafts/prescribeit-x-1.txt`
- `content/social-drafts/prescribeit-x-2.txt`
- `content/social-drafts/prescribeit-bsky-1.txt`
- `content/social-drafts/prescribeit-bsky-2.txt`
- `content/manual-recovery-2026-04-29.md` (this file)

Disabled scheduled tasks left in place as a record:
- `prescribeit-x-post-1` (already auto-disabled after firing)
- `prescribeit-bluesky-post-1` (auto-disabled after firing)
- `prescribeit-x-post-2` (manually disabled)
- `prescribeit-bluesky-post-2` (manually disabled)
