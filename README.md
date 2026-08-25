# Personal Dashboard

A set of small, self-contained HTML apps that share a top bar.

## Deploy your own copy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRowanThistlebrooke%2FYTdashh1)

One click → Vercel signs you in, copies the repo to your GitHub, and deploys it. ~30 seconds to a live URL.

## How to use

Open any `.html` file directly in your browser — no build step, no install.

| File | What it is |
|---|---|
| [index.html](index.html) | Goals tracker (Day Ring, Goal Ticker, To Do list) — the home page |
| [health.html](health.html) | Supplement / daily stack tracker |
| [po-water.html](po-water.html) | Water intake tracker |
| [gym.html](gym.html) | Progressive overload gym tracker |
| [topbar.js](topbar.js) | Shared top bar — auto-injected into pages that `<script src="topbar.js">` |

Each app stores its own state in browser `localStorage`. No accounts, no server.

## PWA support

The site is an installable PWA: `manifest.json` + `sw.js` (a minimal
app-shell service worker) let mobile browsers offer "Add to Home
Screen". Two things to know:

- **Service worker requires a real origin.** Opening files directly via
  `file://` (as described above) won't register the service worker or
  show an install prompt — serve the folder over `http(s)://` (e.g.
  `python -m http.server`) to test PWA behavior locally.
- **The service worker caches pages cache-first and doesn't expire on
  its own.** After editing any page, bump `CACHE_NAME` in `sw.js` (see
  the comment at the top of that file) or a browser that's visited
  before will keep serving the old version.

## Verification scripts

`tests/*.mjs` are small dependency-free Node scripts (no test framework,
no `package.json`) that guard a few regressions: run any of them with
`node tests/<name>.mjs`. `scripts/generate-icons.py` (needs Pillow)
regenerates the placeholder PWA icons in `icons/` — re-run it after
swapping in real branding.

## Building from scratch

[BUILD_DASHBOARD.md](BUILD_DASHBOARD.md) is the prompt I gave Claude to generate `index.html` — paste it into Claude if you want to rebuild that page yourself.
