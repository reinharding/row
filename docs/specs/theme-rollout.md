---
label: ready-for-agent
---

# Roll out the dark-pastel theme to gym.html, health.html, po-water.html, index.html

## Problem Statement

`habits.html` was recently restyled to a new dark-pastel visual system (design
tokens for background, card, text, border, and status colors, plus a Nunito
font stack), and the shared App Shell nav (`topbar.js`) was restyled to
match. The other four pages in `row` — `gym.html`, `health.html`,
`po-water.html`, and `index.html` — still use their own, older visual
systems, each with different colors and a different font. As a result the
app looks inconsistent: users bounce between a freshly restyled Habits page
and older-looking pages for Gym, Health, Water, and the main dashboard.

## Solution

Extract `habits.html`'s design tokens into a shared `theme.css`, then repaint
each of the four remaining pages to use those tokens and the Nunito font —
without changing their markup structure, their own component CSS class
names, or any behavior. Each page keeps its own page-specific components
(`po-*` on gym.html, `stack-*` on health.html, index.html's custom widgets,
etc.); only the colors, font, and radii they reference change to point at
the shared tokens.

## User Stories

1. As a user of `row`, I want every page to share the same background,
   card, and text colors, so that the app feels like one cohesive product
   rather than five different-looking pages.
2. As a user of `row`, I want the same typeface across every page, so that
   switching between Habits, Gym, Health, Water, and the main dashboard
   doesn't feel jarring.
3. As a user of `row`, I want status colors (good/warn/bad/info) to mean the
   same thing visually on every page, so that a "bad" reading on Health
   looks the same kind of "bad" as a missed habit on Habits.
4. As a user of `row`, I want this visual rollout to change nothing about
   how any page behaves, so that my existing data, layouts, and workflows on
   Gym, Health, Water, and the dashboard keep working exactly as before.
5. As the developer maintaining `row`, I want a single shared `theme.css`
   file, so that a future palette tweak happens once instead of being
   copy-pasted across five `<style>` blocks.
6. As the developer maintaining `row`, I want `po-water.html` restyled
   first as a pilot, so that `theme.css` is proven out on the page
   structurally closest to `habits.html` before tackling the three pages
   with larger, more page-specific component systems.
7. As the developer maintaining `row`, I want `health.html` and
   `index.html`'s existing CSS variables (`--text-primary`, `--success`,
   `--warning`, `--danger`, etc.) renamed to the canonical token names
   (`--text-1..4`, `--good`, `--warn`, `--bad`, `--info`) rather than kept
   as separate aliases, so the codebase converges on one naming vocabulary
   instead of two parallel ones.
8. As the developer maintaining `row`, I want a regression check that
   catches a page silently reintroducing its own `:root` color tokens or an
   old variable name, so that a future edit can't quietly drift a page back
   off the shared palette.
9. As a user on gym.html specifically, I want the theme rollout to leave the
   exercise logging grid, history bars, and modals (`po-log-grid`,
   `po-hist-row`, `po-modal`, etc.) structurally untouched, so that this
   page's most complex, actively-used UI isn't put at risk by a cosmetic
   change.
10. As a user on health.html specifically, I want the supplement
    ticker/progress-track UI (`stack-ticker`, `stack-progress-track`, etc.)
    to keep working exactly as before, just repainted.
11. As a user on index.html specifically, I want the day-ring SVG
    visualization and its sun-cycle palette (per `BUILD_DASHBOARD.md`) to be
    evaluated on a case-by-case basis against the shared tokens, since it's
    a bespoke visualization rather than a standard card/text element.

## Implementation Decisions

- **New file `theme.css`** at the repo root, holding only CSS custom
  properties: `--bg`, `--bg-card`, `--text-1`, `--text-2`, `--text-3`,
  `--text-4`, `--border`, `--border-strong`, `--good`, `--warn`, `--bad`,
  `--info`, `--font`, `--font-mono` — the same set and values currently
  inlined in `habits.html`'s `:root` block. See
  `docs/adr/0001-theme-css-tokens-only.md`.
- **Tokens only, no shared component classes.** `theme.css` does not
  define `.shell`, `.card`, `.icon-btn`, `.divider`, `.day-pill`, or any
  other component class. Each page keeps its own local component CSS.
- **No structural/markup changes.** This is a repaint: page DOM structure,
  class names (other than color/font declarations), and JS behavior are
  untouched.
- **`habits.html` switches from its inline `:root` block to linking
  `theme.css`** (a `<link>` tag), as the first step, so the extraction is
  validated against the page it was extracted from before any other page
  changes.
- **Font**: all four pages adopt `--font` (Nunito stack) for body text,
  replacing their current font declarations (gym.html/po-water.html's
  system/Inter stack; health.html/index.html's unspecified default).
- **Variable renaming, not aliasing**: `health.html` and `index.html`
  rename their internal CSS variable usages to the canonical names
  (`--text-primary` → `--text-1`, `--success` → `--good`, `--warning` →
  `--warn`, `--danger` → `--bad`, etc.) rather than keeping their own names
  as aliases pointing at the shared tokens.
- **gym.html and po-water.html** already use the canonical variable names
  (`--bg`, `--text-1..4`, `--good/--warn/--bad`) with different hex values;
  for these pages the change is swapping local `:root` values for the
  `theme.css` link, no renaming needed, plus adding `--info` and
  `--border-strong` if a page currently lacks them.
- **Rollout order**: (1) extract `theme.css` from `habits.html`, (2)
  `po-water.html` as the structural pilot, (3) `gym.html`, (4)
  `health.html`, (5) `index.html`. Ticket 1 blocks tickets 2–5; tickets 2–5
  have no dependency on each other.
- **index.html's day-ring/sun-cycle visualization**: treated as a
  page-specific bespoke component like `po-*`/`stack-*` — its own palette
  choices are out of scope for token replacement unless they happen to use
  one of the now-shared token names, in which case they point at the shared
  token instead of a local redefinition.

## Testing Decisions

- **Seam**: a single new static-analysis script, `tests/check-theme-tokens.mjs`,
  following the existing dependency-free pattern in `tests/check-no-finance-references.mjs`
  and `tests/check-input-font-size.mjs` (regex-parse each page's `<style>`
  block, assert an invariant, `process.exit(1)` on violation, run via
  `node tests/check-theme-tokens.mjs`).
- For each of the five pages (`habits.html`, `gym.html`, `health.html`,
  `po-water.html`, `index.html`), the script asserts:
  - the page links `theme.css`,
  - its own `<style>` block does not redefine any of the canonical token
    names in a page-local `:root` (i.e., no page shadows the shared
    tokens),
  - none of the old, pre-rollout variable names that have a canonical
    equivalent (`--text-primary`, `--text-secondary`, `--text-tertiary`,
    `--text-quaternary`, `--success`, `--warning`, `--danger`) still appear
    anywhere in the page's source. Page-specific tokens with no canonical
    equivalent (`--accent`, `--bg-secondary`, `--tag-stack`, etc., per
    `docs/adr/0001-theme-css-tokens-only.md`) are expected to remain as
    page-local variables and are not checked here,
  - `--font` resolves to a value starting with `'Nunito'`.
- This is a content/regression check, not a visual/behavioral test — it
  only asserts what CSS variables and links are present in the HTML source,
  matching this repo's existing precedent of testing external, observable
  properties of the static files rather than rendered output.
- Extend the script incrementally: it can start covering only `theme.css`
  + `habits.html` after ticket 1, then gain an assertion block per page as
  each subsequent ticket lands.
- Manual verification (open each page in a browser, visually compare
  against `habits.html`) remains the way to confirm the actual repaint
  looks right; the script only guards against regression afterward.

## Out of Scope

- Any structural/markup refactor of the four target pages.
- Sharing component classes (`.card`, `.icon-btn`, etc.) across pages.
- Any behavior, data, or logic change on any page.
- Redesigning index.html's day-ring/sun-cycle visualization.
- Adding a build step, CSS preprocessor, or bundler — `theme.css` is a
  plain stylesheet linked directly, consistent with this repo having no
  existing build tooling.
- Light-mode support (none of the five pages currently have one).
- Automated visual regression / screenshot testing.

## Further Notes

- `docs/adr/0001-theme-css-tokens-only.md` records why component classes
  aren't shared and why health.html/index.html rename rather than alias
  their variables.
- `CONTEXT.md`'s new **Design Tokens** glossary entry documents `theme.css`
  as distinct from the **App Shell** (topbar.js-injected chrome).
- Per the fact-finding pass: `gym.html` (~3474 lines) and `index.html`
  (~1714 lines) are the largest, most component-heavy pages and carry the
  most risk in this rollout; `po-water.html` (~1134 lines) is the closest
  structural match to `habits.html` and is deliberately sequenced first as
  the pilot.
