# Design

## Theme

Dark. A gamer in a dimly lit room, mid-ARAM match, hitting Alt+Q to summon a brief arcane overlay that glows with data before fading. The surface is near-black; the brand colors do all the talking.

## Color Strategy

Committed: one saturated color (emerald green, the "arcane glow") carries 30-60% of the visual identity against a dark surface. Gold serves as the secondary accent, evoking circuit traces and Hextech craftsmanship.

## Palette (OKLCH)

```css
:root {
  /* Surface hierarchy */
  --bg:       oklch(0.08 0.005 140);   /* near-black, faintest green whisper */
  --surface:  oklch(0.12 0.010 140);   /* panels, cards, elevated areas */
  --surface-2: oklch(0.16 0.012 140);  /* nested surfaces, hover states */

  /* Brand colors */
  --primary:  oklch(0.65 0.16 140);    /* vivid emerald — the arcane glow */
  --accent:   oklch(0.75 0.12 85);     /* warm gold — circuit traces, highlights */

  /* Text */
  --ink:      oklch(0.95 0.008 140);   /* near-white, faint green tint */
  --muted:    oklch(0.55 0.030 140);   /* secondary text, dimmed green */

  /* Semantic */
  --success:  oklch(0.72 0.15 145);    /* positive data, high win rate */
  --warning:  oklch(0.78 0.14 70);     /* caution, mid-range data */
  --danger:   oklch(0.62 0.18 25);     /* negative data, low win rate */
}
```

### Contrast checks (approximate)

| Pair | Ratio | Pass |
|------|-------|------|
| ink on bg (0.95 vs 0.08) | ~16:1 | ≥7:1 ✓ |
| primary on bg (0.65 vs 0.08) | ~7.5:1 | ≥4.5:1 ✓ |
| accent on bg (0.75 vs 0.08) | ~11:1 | ≥4.5:1 ✓ |
| muted on bg (0.55 vs 0.08) | ~5:1 | ≥3.5:1 ✓ |
| white on primary (fill) | — | Saturated mid-L → white text ✓ |
| white on accent (fill) | — | Saturated mid-L → white text ✓ |

## Typography

**Font families:**
- **Inter** — body and display. Clean, excellent for data, wide weight range (400-700). One family keeps the overlay compact and consistent.
- **JetBrains Mono** — numbers and data alignment. Monospaced digits ensure win-rate columns don't jitter.

**Scale (overlay context):**
The HUD overlay is compact. No hero headings. The scale is tighter than a typical web page.

```css
:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Overlay scale — compact, glanceable */
  --text-xs:   0.75rem;    /* 12px — labels, timestamps */
  --text-sm:   0.875rem;   /* 14px — secondary data */
  --text-base: 1rem;       /* 16px — primary data */
  --text-lg:   1.25rem;    /* 20px — section headings */
  --text-xl:   1.5rem;     /* 24px — hero number (win rate %) */

  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
}
```

**Data display rules:**
- Win-rate percentages use `--font-mono` at `--text-xl` or `--text-lg` for the top recommendation
- Champion/augment names use `--text-base` with `--leading-tight`
- Rank numbers use `--font-mono` at `--text-sm`

## Motion

Snappy with arcane glow. The overlay appears fast, holds briefly, and fades. Motion conveys "oracle vision appearing" — not bouncing, not sliding dramatically.

**Overlay entrance:**
- Slide in from the right edge, 200ms, ease-out-expo (cubic-bezier(0.16, 1, 0.3, 1))
- Simultaneous fade-in, 150ms
- A subtle glow pulse on the primary color, 400ms, one-shot (opacity 0.6 → 1 → 0.8)

**Overlay exit:**
- Fade out, 300ms, ease-in-expo
- No slide-out — it dissolves, like a vision fading

**Data reveal (when content loads):**
- Staggered list items, 50ms delay between each
- Each item: fade-in + slight translateY(4px → 0), 150ms, ease-out-quart

**Auto-hide timer:**
- A thin progress bar at the bottom, 5s linear drain
- Bar color: primary at 40% opacity
- On completion: trigger exit animation

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations become instant opacity transitions */
  .overlay { transition: opacity 100ms ease; }
  .data-item { transition: opacity 100ms ease; }
  .progress-bar { transition: none; }
}
```

## Layout

**HUD overlay dimensions:**
- Width: 320px (fixed, not responsive — this is a desktop overlay)
- Max height: 480px (scrollable if content exceeds)
- Padding: 16px
- Border-radius: 8px (subtle, not bubbly)

**Internal structure:**
- Header: champion/augment name + context label
- Body: ranked list of recommendations (1-5 items)
- Footer: progress bar + data source attribution

**Z-index scale:**
```css
:root {
  --z-overlay: 100;     /* HUD overlay itself */
  --z-tooltip: 110;     /* hover details */
  --z-modal: 200;       /* settings panel */
}
```

**Settings panel (future):**
- Separate window, not overlaid on the game
- Standard app layout, not HUD constraints
- Uses the same color palette but with more breathing room

## Components

**Ranked list item:**
```
┌─────────────────────────────────┐
│  1   Champion Name          54.2% │  ← mono font for rank + %
│      ▓▓▓▓▓▓▓▓▓▓▓░░░░░  (bar)    │  ← win-rate bar in primary
└─────────────────────────────────┘
```
- Rank number: mono, primary color, prominent
- Name: body font, ink color
- Win rate: mono, primary color if top-3, muted otherwise
- Bar: primary fill to proportional width, surface-2 background

**Top recommendation highlight:**
- Same as ranked item but with a subtle primary glow (box-shadow: 0 0 12px oklch(0.65 0.16 140 / 0.3))
- Slightly larger text for the champion name
- This is the "glance target" — the one thing the player reads

**Progress bar:**
- 2px height, full width
- Surface-2 background
- Primary fill, linear drain over 5s
- Position: bottom of overlay, outside padding
