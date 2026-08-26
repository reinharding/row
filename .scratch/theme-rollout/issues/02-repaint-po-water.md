# 02: Repaint po-water.html with the shared theme

**What to build:** `po-water.html` links `theme.css` and uses its tokens
for all color/font declarations, replacing its current local `:root`
values (which already use the canonical variable names, e.g. `--bg`,
`--text-1..4`, `--good/--warn/--bad`, just different hex values) and its
current system/Inter font stack with `--font` (Nunito). Add `--info` and
`--border-strong` if the page currently lacks them. No markup/structural
changes: `.shell`, `.day-pill`, `.header`, `.icon-btn`, `.divider`, `.card`
and all other po-water.html-specific classes keep their current DOM
structure and behavior, only repainted.

This page is the structural pilot — it's the closest match to
habits.html's component patterns, so it proves out `theme.css` before the
larger, more page-specific pages (gym.html, health.html, index.html).

**Blocked by:** 01 (theme.css must exist)

**Status:** ready-for-agent

- [x] po-water.html links `theme.css` instead of defining its own color/font `:root` values
- [x] All colors on the page now resolve through the shared tokens (no local color hex values left in `:root`)
- [x] Page uses Nunito (`--font`) for body text
- [x] No DOM structure, class names, or JS behavior changed
- [x] Visual check in browser: page matches habits.html's palette while keeping its own layout
- [x] `tests/check-theme-tokens.mjs` gains assertions for po-water.html (links theme.css, no redefinition, no old vocabulary) and passes
