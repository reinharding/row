# Mobile / PWA UI reference research

Research supporting turning `row` into an installable PWA with a mobile-app
feel (bottom tab bar: Main/Health/Fitness/Habits). Primary sources only
(Apple, Google, W3C, MDN/WHATWG); URLs below were verified live (fetched or
confirmed via search snippets matching the live page's own meta description)
on 2026-08-24/25.

## 1. Apple HIG — tab bars, `env(safe-area-inset-*)`, `viewport-fit=cover`

**Tab bars**: https://developer.apple.com/design/human-interface-guidelines/tab-bars

A tab bar "lets people navigate between top-level sections of your app" and
should be used for navigation, not for actions. Apple gives target icon
dimensions per shape for both regular and compact tab bars — regular: circle
25×25pt, square 23×23pt, wide 31pt; compact: circle 18×18pt, square 17×17pt,
wide 23pt. The standard iOS tab bar container is 49pt tall (e.g. 390×49pt on
common device widths), consistent with Apple's general 44×44pt minimum
tappable-target guidance elsewhere in the HIG. Starting with iPadOS 18 the
system can show the tab bar near the top of the screen, optionally
convertible to a sidebar — not directly relevant to this project's mobile
web bottom-bar use case, but confirms tab bars are meant for top-level,
persistent navigation, which matches the planned Main/Health/Fitness/Habits
bar.

**Safe area insets / `viewport-fit=cover`**: https://webkit.org/blog/7929/designing-websites-for-iphone-x/

This is the original WebKit engineering blog post (Apple-owned, webkit.org)
introducing the feature in iOS 11. By default `viewport-fit` is `auto`, and
Safari automatically insets page content within the display's safe area,
filling the outer strip with the page's `background-color`. Setting
`viewport-fit=cover` in the viewport `<meta>` tag lets the page extend
edge-to-edge, at the cost of needing to manually protect content from the
notch/corners/home-indicator using the four new environment variables
exposed via `env()`: `safe-area-inset-top`, `-right`, `-bottom`, `-left`.
Example from the post:
```html
<meta name="viewport" content="initial-scale=1, viewport-fit=cover">
```
```css
padding-left: env(safe-area-inset-left);
```
The post also recommends combining insets with `max()`/`min()` so fixed
minimum padding is preserved in orientations where the safe-area inset is 0
(e.g. `padding: max(12px, env(safe-area-inset-bottom))` for a bottom bar).

**`env()` — spec/standardization status**: https://developer.mozilla.org/en-US/docs/Web/CSS/env

MDN documents `env()` as CSS Environment Variables Module Level 1
(https://drafts.csswg.org/css-env-1/, W3C draft) plus CSS Values and Units
Module Level 4, and lists it as "Baseline: widely available" since January
2020. `safe-area-inset-*` returns `0` on rectangular viewports with no
device chrome and a positive px value where a notch, rounded corner, or a
toolbar/keyboard occupies part of the viewport. A default/fallback value can
be supplied as the function's second argument, e.g.
`env(safe-area-inset-bottom, 16px)`, which matters for browsers/platforms
that don't define the variable (falls back rather than producing an invalid
declaration).

**Implication for `row`**: the planned fixed bottom tab bar should set
`viewport-fit=cover` in the viewport meta tag and pad its bottom edge with
`max(<base-padding>, env(safe-area-inset-bottom))` to clear the iPhone home
indicator without leaving a gap on devices/browsers where the inset is 0.

## 2. Material Design 3 — bottom navigation (navigation bar)

https://m3.material.io/components/navigation-bar/guidelines

M3 calls this component the "navigation bar" (bottom nav). It provides
access to **three to five destinations**, sits at the bottom of the window,
and each destination is an icon + label, with exactly one destination active
at a time. The active destination gets a filled icon in a pill-shaped
indicator; inactive destinations use an outlined icon variant where
available. Explicit limitation stated by the guidelines: **don't use a
navigation bar for more than five items** (they'll collide, and there's not
enough room for localized/translated labels) **or for fewer than three**
(use tabs instead). Layout can go vertical (compact windows, <600dp wide —
phone portrait) or horizontal (medium windows, 600–839dp — tablet/foldable
portrait).

**Implication for `row`**: 4 destinations (Main/Health/Fitness/Habits) sits
comfortably inside M3's recommended 3–5 range.

## 3. PWA installability requirements

**Chrome's install criteria**: https://web.dev/articles/install-criteria (Chrome for Developers / web.dev, Google-owned)

To be installable/eligible for `beforeinstallprompt`, Chromium requires:
- Served over HTTPS.
- A linked web app manifest with at minimum `short_name` or `name`,
  `start_url`, and `display` set to one of `fullscreen`, `standalone`,
  `minimal-ui`, or `window-controls-overlay`.
- `prefer_related_applications` absent or `false`.
- Icons in the manifest of **at least 192×192px and 512×512px**.
- A registered service worker with a fetch event handler (offline-capable
  service worker, per Chrome's own follow-up post below).
- Not already installed.
- Chrome's engagement heuristic: the user has interacted with the page at
  least once, generally after some time on site (historically ~30s), before
  the automatic install prompt is offered.

**Service worker specifics**: https://developer.chrome.com/blog/update-install-criteria

Chrome for Developers' own blog post on installability criteria updates
confirms the check is presence of a service worker "with a fetch event
handler" — Chrome doesn't (currently) deeply verify true offline support,
just that the fetch handler exists (an earlier, stricter offline-simulation
check from Chrome 89 was walked back for developer-experience reasons per
this same post).

**Manifest reference / maskable icons**: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest and https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable

MDN's manifest reference notes every manifest member is technically
optional per spec, but installability in practice requires `name`/
`short_name`, `icons`, `start_url`, and `display`. The `icons[].purpose`
field accepts `any`, `maskable`, and `monochrome`; a maskable icon must be a
square image with its essential content inside a safe zone — **a circle
centered on the icon with a radius equal to 40% of the icon's width** — so
platforms (notably Android adaptive icons) can crop/mask it into shapes
without clipping the important content.

**Implication for `row`**: manifest.json needs `name`/`short_name`,
`start_url`, `display: "standalone"`, and icons at 192×192 and 512×512 (plus
ideally a maskable 512×512 variant respecting the 40%-radius safe zone), and
a minimal service worker registered with at least a `fetch` listener.

## 4. iOS Safari auto-zoom on input focus

No official Apple/WebKit documentation or WebKit Bugzilla report describing
this as intended behavior was found. A WebKit Bugzilla search
(`bugs.webkit.org`, search terms "input zoom font-size") returned only
unrelated bugs (NSSearchField text-zoom scaling, an unrelated textarea
Enter-key bug, and a Windows test-failure triage bug) — none of which
document or track the iOS zoom-on-focus-below-16px behavior. MDN's CSS/HTML
input documentation does not mention this behavior either.

**Conclusion: this is undocumented/community-inferred behavior, not a
specified or officially documented feature.** The widely repeated
workaround — set `font-size: 16px` or larger on form inputs so Safari does
not zoom the viewport on focus — is corroborated only by secondary sources
(e.g. CSS-Tricks, various blog posts, GitHub issue threads on unrelated
projects hitting the same symptom) that describe it as observed behavior,
not by a primary Apple/W3C spec. Treat the "16px" number as a
practitioner-verified empirical threshold, not a documented API contract,
and re-test on-device since Apple could change or has changed the exact
threshold across iOS versions without announcement.

**Implication for `row`**: apply `font-size: 16px` (or `1rem` at a 16px
base) to all `<input>`/`<select>`/`<textarea>` elements on mobile, treating
it as a defensive/empirical fix rather than a guaranteed contract.

## 5. Dark theme guidance

**Material Design 3 — color roles**: https://m3.material.io/styles/color/roles

M3 defines **26 standard color roles** across six groups (primary,
secondary, tertiary, error, surface, outline) that map semantically to UI
elements regardless of light/dark theme — e.g. `surface`, `on-surface`,
`surface-container` variants — so switching themes is a matter of swapping
the underlying tonal palette rather than hand-picking new colors per
component.

**Material Design 3 — elevation**: https://m3.material.io/styles/elevation

M3 represents elevation primarily through **tonal color overlays** rather
than (or in addition to) shadows: higher elevation surfaces get a more
prominent tonal overlay (sourced from the primary color) mixed into the
surface color, which is especially important in dark theme where shadows
read poorly — five predefined surface tonal steps (Surface 1–5) are
available for components to signal elevation via color/tone rather than
relying on drop shadows.

**Apple HIG — Dark Mode**: https://developer.apple.com/design/human-interface-guidelines/dark-mode (also indexed under `.../foundations/dark-mode`)

Apple's guidance: dark mode is a genuine alternative appearance, not just
inverted colors — every platform except watchOS offers a dark *alternative*
to its default light appearance (watchOS is pure black always). Apple
explicitly calls out that accessibility settings interact with dark
mode in ways that can hurt legibility: turning on **Increase Contrast**
while in Dark Mode can reduce contrast between dark text and dark
backgrounds in some layouts, so Apple recommends testing content with
Increase Contrast and Reduce Transparency both separately and together to
confirm legibility holds up under all combinations.

**Implication for `row`**: since the repo already uses `--bg:#0a0a0b` (a
near-black, not pure black) across pages, this aligns with M3/Apple's
guidance of avoiding true `#000` for large surfaces and instead using a very
dark but distinguishable base tone, with tonal (not just shadow-based)
differentiation for elevated cards/bars — worth applying to the new bottom
tab bar's background so it reads as "elevated" over page content in dark
mode.
