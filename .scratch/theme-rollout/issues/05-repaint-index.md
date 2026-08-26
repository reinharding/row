# 05: Repaint index.html with the shared theme

**What to build:** `index.html` links `theme.css` and uses its tokens for
all color/font declarations. This page currently has the sparsest token
set (`--text-primary/secondary/tertiary`, `--success`, `--warning`,
`--danger`, hardcoded `--bg`-less background) — internal usages of these
names are renamed to the canonical token names (`--text-1..4`, `--good`,
`--warn`, `--bad`, etc.) per `docs/adr/0001-theme-css-tokens-only.md`, not
kept as aliases, and the hardcoded background gets a `--bg` token. Font
switches to `--font` (Nunito). No markup/structural changes: `gm-card`,
`fp-modal`, and other index.html-specific components keep their current
DOM structure and behavior, only repainted.

The `day-ring` SVG visualization and its bespoke sun-cycle palette (per
`BUILD_DASHBOARD.md`) is evaluated case-by-case: only touched where it
happens to use one of the now-shared token names (in which case it points
at the shared token instead of a local redefinition); its own distinct
palette choices are otherwise left alone.

**Blocked by:** 01 (theme.css must exist)

**Status:** ready-for-agent

- [x] index.html links `theme.css` instead of defining its own color/font `:root` values
- [x] All of index.html's old variable names (`--text-primary/secondary/tertiary`, `--success`, `--warning`, `--danger`) no longer appear anywhere in the file — internal usages are renamed to the canonical token names
- [x] Page uses Nunito (`--font`) for body text
- [x] No DOM structure, class names, or JS behavior changed, including in `gm-card`, `fp-modal`, and the day-ring visualization
- [x] day-ring's bespoke sun-cycle palette is preserved except where it happens to reuse a canonical token name
- [x] Visual check in browser: page matches habits.html's palette while keeping its own layout and visualizations
- [x] `tests/check-theme-tokens.mjs` gains assertions for index.html (links theme.css, no redefinition, no old vocabulary) and passes
