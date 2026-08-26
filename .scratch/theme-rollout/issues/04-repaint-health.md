# 04: Repaint health.html with the shared theme

**What to build:** `health.html` links `theme.css` and uses its tokens for
all color/font declarations. Unlike gym.html/po-water.html, this page uses
an entirely different CSS variable vocabulary today. Of these, only the
ones with a real canonical equivalent in `theme.css` — `--text-primary`,
`--text-secondary`, `--text-tertiary`, `--text-quaternary`, `--warning` —
get renamed in place to the canonical names (`--text-1..4`, `--warn`) per
`docs/adr/0001-theme-css-tokens-only.md`, not kept as aliases. The rest
(`--accent`, `--accent-glow`, `--bg-secondary`, `--bg-input`,
`--bg-input-focus`, `--bg-dropdown`, `--tag-stack`, `--tag-stack-bg`, and
`--warning-bg` renamed to `--warn-bg` for consistency) have no shared
counterpart and stay as page-local variables — they're outside what
`theme.css` shares, not omissions. Font switches to `--font` (Nunito). No
markup/structural changes: the `stack-*` component system (`stack-card`,
`stack-ticker`, `stack-progress-track`, `stack-result`, etc.) keeps its
current DOM structure and behavior, only repainted.

**Blocked by:** 01 (theme.css must exist)

**Status:** ready-for-agent

- [x] health.html links `theme.css` instead of defining its own color/font `:root` values
- [x] health.html's old canonical-equivalent variable names (`--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-quaternary`, `--warning`) no longer appear anywhere in the file — internal usages are renamed to `--text-1..4`/`--warn`. Page-local-only tokens with no `theme.css` equivalent (`--accent`, `--bg-secondary`, `--tag-stack`, etc.) are expected to remain, just not redefining any canonical name
- [x] Page uses Nunito (`--font`) for body text
- [x] No DOM structure, class names, or JS behavior changed, including in the supplement ticker/progress-track UI
- [x] Visual check in browser: page matches habits.html's palette while keeping its own layout
- [x] `tests/check-theme-tokens.mjs` gains assertions for health.html (links theme.css, no redefinition, no old vocabulary) and passes
