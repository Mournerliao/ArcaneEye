# ArcaneEye

> Desktop HUD overlay for League of Legends ARAM players — real-time win-rate recommendations at a glance.

ArcaneEye reads your ARAM game state via screenshot, identifies champions or hex augments on screen, queries win-rate data from [ARAMGG](https://aramgg.com), and displays a ranked recommendation overlay. It appears for seconds, not minutes — built for ARAM's time-pressured decision windows.

## Features

- **Champion select overlay** — shows win-rate rankings for the current champion pool
- **Hex augment recommendations** — displays the strongest augments for your champion
- **HUD overlay** — always-on-top, click-through, auto-hide after 5 seconds
- **Toggle with `Alt+Q`** — summon and dismiss the overlay without leaving the game
- **Dual themes** — switch between Hextech Cyan and Hextech Gold palettes

## Prerequisites

- [Bun](https://bun.sh) (v1.3+)
- [Rust](https://www.rust-lang.org/tools/install) toolchain
- [Tauri CLI prerequisites](https://v2.tauri.app/start/prerequisites/) for your platform

## Getting started

```bash
# Clone the repository
git clone https://github.com/<your-username>/ArcaneEye.git
cd ArcaneEye

# Install dependencies
bun install

# Start in development mode
bun run tauri:dev
```

> [!NOTE]
> In development mode the overlay is fully interactive (clicks register normally). In release builds the overlay becomes click-through so it never steals focus from the game.

## Scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `bun run dev`         | Start Vite dev server (frontend) |
| `bun run tauri:dev`   | Start Tauri in development mode  |
| `bun run tauri:build` | Build the desktop application    |
| `bun run build`       | Type-check and build frontend    |
| `bun run type-check`  | Run TypeScript type-checking     |
| `bun run lint`        | Lint source files with ESLint    |
| `bun test`            | Run tests                        |

## Project structure

```
ArcaneEye/
├── src/                  # React frontend
│   ├── components/       # UI components (HudPanel, RankedList)
│   ├── hooks/            # Custom React hooks (useAutoHide)
│   ├── services/         # Data services and placeholder data
│   ├── stores/           # Zustand state (hud, theme)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Root component
│   └── index.css         # Design tokens, themes, global styles
├── src-tauri/            # Tauri (Rust) backend
│   └── src/
│       ├── lib.rs        # App entry, click-through logic
│       └── main.rs       # Rust main
├── harness/              # Docs, workflows, agent skills
└── DESIGN.md             # Visual specification (palette, typography, motion)
```

## Tech stack

| Layer       | Technology                               |
| ----------- | ---------------------------------------- |
| Desktop     | [Tauri v2](https://v2.tauri.app/) (Rust) |
| Frontend    | React 19 + TypeScript                    |
| Styling     | Tailwind CSS v4                          |
| State       | Zustand                                  |
| Animation   | Motion (Framer Motion)                   |
| Bundler     | Vite 6                                   |
| Package mgr | Bun                                      |

## Theming

ArcaneEye ships with two dark Hextech themes defined as CSS custom properties. The active theme persists across sessions via Zustand's `persist` middleware.

| Theme        | Primary | Accent | Aesthetic                            |
| ------------ | ------- | ------ | ------------------------------------ |
| Hextech Cyan | Cyan    | Gold   | LoL client magic, cold & precise     |
| Hextech Gold | Gold    | Cyan   | Piltover brass, warm & authoritative |

Toggle themes at runtime via the button in the top-right corner, or programmatically through `useThemeStore`.
