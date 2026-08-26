# 03: Repaint gym.html with the shared theme

**What to build:** `gym.html` links `theme.css` and uses its tokens for
all color/font declarations, replacing its current local `:root` values
(pure-black palette, already using canonical variable names except
missing `--info`) and its system/Inter font stack with `--font` (Nunito).
No markup/structural changes: the `po-*` component system (`po-modal`,
`po-exercise-bar`, `po-hist-row`, `po-log-grid`, `po-reps-pill`, etc.) —
this page's largest and most actively-used UI — keeps its current DOM
structure and behavior, only repainted.

**Blocked by:** 01 (theme.css must exist)

**Status:** ready-for-agent

- [x] gym.html links `theme.css` instead of defining its own color/font `:root` values
- [x] All colors on the page (including within `po-*` components) resolve through the shared tokens
- [x] Page uses Nunito (`--font`) for body text
- [x] No DOM structure, class names, or JS behavior changed, including in the exercise logging grid, history bars, and modals
- [x] Visual check in browser: page matches habits.html's palette while keeping its own layout
- [x] `tests/check-theme-tokens.mjs` gains assertions for gym.html (links theme.css, no redefinition, no old vocabulary) and passes
