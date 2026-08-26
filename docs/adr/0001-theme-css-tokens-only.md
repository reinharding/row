# theme.css shares design tokens only, not component classes

Rolling out habits.html's dark-pastel visual system to gym.html, health.html,
po-water.html, and index.html required deciding how much to share. We
extract a `theme.css` holding only CSS custom properties (colors and font
stack; radii stay hardcoded per component, not tokenized) — not shared
component classes like `.card` or `.icon-btn`. Each page keeps its own
local component CSS, repainted with the shared variables.

Sharing component classes was the more thorough option, but it would force
retrofitting each page's markup onto habits.html's DOM patterns (`.shell`,
`.card`, `.divider`, `.day-pill`), which for gym.html and index.html in
particular means restructuring large, page-specific component systems
(`po-*`, `stack-*`, custom SVG rings) that don't map onto habits.html's
idiom at all. That's a structural rewrite, not a re-skin, and disproportionate
to the goal of visual consistency. Tokens-only keeps each page's diff to a
repaint.

A consequence: health.html and index.html use a different CSS variable
vocabulary today (`--text-primary`, `--success`, etc.) and must rename their
internal usages to the shared token names rather than just swapping values.
This only applies to variables with a real canonical equivalent in
`theme.css`. Page-specific tokens with no shared counterpart (health.html's
`--accent`, `--bg-secondary`, `--tag-stack`, etc.) stay as page-local
variables — they're outside what `theme.css` shares, not omissions.
