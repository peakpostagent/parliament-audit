# Mastodon mirror — one-time setup (5 minutes)

The mirror bot (`scripts/social-brief/mastodon-rss-mirror.ts`) is committed
and wired into the daily-ops cron. It needs **one human-side step**: create
the Mastodon account, generate an API token, and drop two env vars into
`.env`.

## 1 — Pick an instance

**Use `mstdn.ca`.**

It's the largest general-purpose Canadian Mastodon instance, English-speaking,
moderated, and has the densest concentration of Canadian journalists,
academics, and civil-society folks. Joining there puts us in the right
discovery surface from day one.

Alternatives if `mstdn.ca` is closed to signups for any reason:
- `journa.host` — explicitly for journalists; would actually be on-brand,
  but they require ID verification on signup.
- `mastodon.social` — the flagship instance, fine fallback. Less Canadian-specific.
- `mas.to` — large, English, no Canadian skew.

## 2 — Create the account

1. Go to <https://mstdn.ca/auth/sign_up>
2. Sign up with `peakpostagent@gmail.com` (or a `+mastodon` alias if you
   prefer to keep this separate from your other inbox tags).
3. Pick username: `parliamentaudit`. Full handle becomes `@parliamentaudit@mstdn.ca`.
4. Confirm the email link in your inbox.
5. Set the profile:
   - **Display name**: `Parliament Audit`
   - **Bio**: `Canada's House of Commons votes — logged, categorized, and explained. Non-partisan, factual, every claim sourced. Mirror of parliamentaudit.ca. Author: @alexcroft.`
   - **Avatar**: upload `parliament_audit_avatar.png` from the repo root
     (the maple-leaf-A icon).
   - **Header**: upload `parliament_audit_banner.png` if you want — optional.
   - **Website**: `https://parliamentaudit.ca`
   - **Verify website**: paste the verification link Mastodon shows you
     into a `<link rel="me">` tag in the site footer — I can wire that
     into `apps/web/src/app/layout.tsx` once you have the URL.
   - **Visibility**: "Public profile" (default).

## 3 — Generate the access token

1. Click your avatar → **Preferences** (in some themes, Settings → Development)
2. **Development** (left sidebar) → **New application**
3. Application name: `Parliament Audit RSS Mirror`
4. **Scopes**: uncheck everything except **`write:statuses`**. That's the
   only scope the bot needs. Don't grant `read`, `write:accounts`, or
   `follow` scopes — least-privilege.
5. Submit → click into the application you just made → copy the
   **Your access token** value (NOT client key / client secret).

## 4 — Drop the creds into `.env`

Add two lines to `.env` at the repo root:

```env
MASTODON_INSTANCE_URL=https://mstdn.ca
MASTODON_ACCESS_TOKEN=<paste the access token from step 3>
```

Do **not** commit `.env` (already gitignored). Do not paste the token in
chat or Slack — it grants posting permission for the account.

## 5 — Test it

```bash
# Dry-run first — confirms the RSS parses and shows what would be posted
npx tsx scripts/social-brief/mastodon-rss-mirror.ts

# When you're happy with the dry-run output, fire the bootstrap.
# The first --apply run is special: it marks all current articles as
# "already seen" without posting them, so we don't dump 17 historic
# articles onto Mastodon in one batch. Subsequent runs only post
# genuinely-new articles.
npx tsx scripts/social-brief/mastodon-rss-mirror.ts --apply
```

After the bootstrap run, the daily-ops cron will pick up the next
article you publish.

## 6 — Verify it's working

After your next article publish (or article re-deploy):

1. Wait for the next daily-ops cron tick (5 AM MDT or 1 PM MDT).
2. Check `https://mstdn.ca/@parliamentaudit` — the new article should
   be there as a toot with #cdnpoli + #cdnmedia hashtags.
3. The toot should auto-render a link preview (Mastodon fetches the
   OG meta from our article page — we already serve those).

## 7 — `<link rel="me">` verification (optional, ~5 min, increases trust)

After the account is up, Mastodon shows you a verification URL on the
Edit Profile page next to the Website field. Paste it here so I can wire
a `<link rel="me" href="…">` tag into the site `<head>`. Mastodon will
then show our profile's "parliamentaudit.ca" link with a green checkmark,
signaling to other users that the account is genuinely ours and not a
squatter / impersonator.

## What this gives us

- Articles auto-toot to Mastodon every time we deploy a new one.
- Reaches the Canadian-journalism Mastodon audience (smaller than Bluesky,
  but high-signal).
- Zero ongoing maintenance — RSS feed updates automatically when we publish
  via the existing Next.js path.
- Tragedy-halt aware: the mirror respects `content/AUTO_PAUSE_TRAGEDY` the
  same way our Bluesky/X publish paths do, so it won't auto-toot during
  breaking-news halts.
- First-run-safe: the initial `--apply` does NOT mass-toot our existing
  backlog. Only future articles flow.

## Cost: $0 forever.
