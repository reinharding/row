# 01: Extract theme.css and migrate habits.html to it

**What to build:** A shared `theme.css` at the repo root holding the design
tokens currently inlined in `habits.html`'s `:root` block (`--bg`,
`--bg-card`, `--text-1..4`, `--border`, `--border-strong`, `--good`,
`--warn`, `--bad`, `--info`, `--font`, `--font-mono`). `habits.html` links
this file via `<link rel="stylesheet" href="theme.css">` instead of
defining these tokens inline, with no visible change to the page. A new
`tests/check-theme-tokens.mjs` static-analysis script (dependency-free
Node, following the pattern of `tests/check-no-finance-references.mjs`)
asserts that `theme.css` defines exactly this token set and that
`habits.html` links it and does not redefine any of these names in its own
`<style>` block.

Tokens-only: no shared component classes (`.card`, `.icon-btn`, etc.) move
into `theme.css` — see `docs/adr/0001-theme-css-tokens-only.md`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] `theme.css` exists at the repo root with the full token set listed above, matching habits.html's current values exactly
- [x] `habits.html` links `theme.css` and no longer defines these tokens inline
- [x] Visually, habits.html is pixel-identical before/after (manual check)
- [x] `tests/check-theme-tokens.mjs` exists, runs via `node tests/check-theme-tokens.mjs`, and asserts theme.css's token set + habits.html's link and non-redefinition
- [x] The new test passes
