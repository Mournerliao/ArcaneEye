# Product

## Register

product

## Users

League of Legends ARAM players. They're mid-game, sitting in a dimly lit room with the game filling most of their screen. They have 20-30 seconds during champion select or hex augment choice to make a decision. They need instant, scannable data: which champion has the highest win rate, which hex augment is strongest. They trigger the overlay with Alt+Q, read at a glance, and it disappears. No browsing, no exploration, no settings tinkering during gameplay.

## Product Purpose

ArcaneEye is a desktop HUD overlay that reads the ARAM game state via screenshot, identifies the relevant champions or hex augments, queries real-time win-rate data from ARAMGG, and displays a ranked recommendation. The overlay appears for seconds, not minutes. It exists to eliminate the "which one should I pick?" hesitation during ARAM's time-pressured decision windows.

Success looks like: a player triggers the overlay, reads the top recommendation in under 2 seconds, picks it, and the overlay fades away. The next time they're in the same situation, they trigger it again without thinking.

## Brand Personality

Arcane intelligence. The interface should feel like consulting a Hextech oracle: mystical, precise, authoritative. Data presented as divination, not spreadsheets. The LoL universe's Hextech aesthetic (cyan glow, gold circuits, crystalline forms) informs the visual language without cosplaying as a game UI.

Three words: **mystical, precise, fleeting**.

## Anti-references

- **Generic dark SaaS tools** (blue accents, rounded cards, standard dark mode). The typical "dark dashboard with blue CTAs" look is exactly what ArcaneEye should avoid.
- **Esports stat websites** (op.gg, u.gg): dense tables, overwhelming data grids, information overload. ArcaneEye is a glanceable overlay, not a research tool.
- **Over-themed fantasy UI**: ornate borders, heavy decorative frames, medieval scroll textures. The arcane direction should be expressed through color and light, not through ornamental dressing.

## Design Principles

1. **Glanceability over completeness**: Show the one number that matters (win rate rank), not the full dataset. The player has seconds, not minutes.
2. **Arcane presence, not decoration**: The mystical aesthetic comes from color (Hextech cyan, warm golds), light (glows, subtle radiance), and motion (smooth reveals, fade-outs), not from ornamental borders or fantasy textures.
3. **Ephemeral by design**: The overlay exists briefly and disappears. Every visual choice should support this transience: fast in, fast out, no visual residue.
4. **Game-state awareness**: The UI must work overlaid on any game screen. High contrast against unpredictable backgrounds. No assumptions about what's behind the overlay.
5. **Data as authority**: Recommendations are backed by real win-rate data from ARAMGG. The visual language should convey confidence and precision, not guesswork.

## Accessibility & Inclusion

- **High contrast**: The overlay must remain readable against any game background. Minimum 7:1 contrast for primary data; 4.5:1 for secondary info.
- **Reduced motion**: All animations must have `prefers-reduced-motion` alternatives. The auto-hide timer is functional, not decorative.
- **Color independence**: Win-rate rankings must be communicated through position and label, not color alone. Players with color vision deficiencies must be able to read the recommendation.
- **Screen reader**: Not applicable for the HUD overlay (it's a visual-only glanceable surface), but the settings/configuration panel should be fully accessible.
