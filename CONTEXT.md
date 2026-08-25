# row

A collection of small, self-contained HTML apps sharing a top bar
(`topbar.js`). Each page owns its own `localStorage` state; most opt into
cross-device sync via `sync.js` (Supabase-backed).

## Language

**Habit**:
A recurring goal tracked by a daily numeric Value. Has a Habit Type and a
Target. Vocabulary and semantics are shared with (ported from) the
`self-improvement-game` project's `CONTEXT.md` — see that file for the
original, fuller definitions. Duplicated here rather than referenced,
since `row` and `self-improvement-game` are independent codebases with
no shared runtime or data.
_Avoid_: Goal (the existing term for `index.html`'s unrelated to-do/goal
ticker feature — a different concept, do not conflate).

**Habit Type**: `build` or `quit`. Same as `self-improvement-game`.

**Target**, **Value**, **Unit**, **Check-in**, **Weekly Target**:
Same definitions as `self-improvement-game`'s `CONTEXT.md`. Weekly Target
is stored per Habit but not yet used for any streak calculation (not
built here).

**App Shell**: The chrome injected by `topbar.js` on every page except
embedded iframes — the sticky top bar and the fixed bottom tab bar
(Main/Health/Fitness/Habits, mobile-only, hidden at `>= 768px`).
Distinct from each page's own content; a page "joining the shell" means
it stops opting out of this injected chrome.

## Notes

`row/habits.html` is the actively-maintained habit tracker going
forward; `self-improvement-game`'s habit tracker is frozen at its first
ticket (create + check-in + progress bar) as a reference implementation.
See `self-improvement-game/docs/adr/0004-row-habits-html-is-primary.md`
for why.
