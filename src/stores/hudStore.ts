import { create } from "zustand"
import type { HudMode, RankedItem } from "@/types"

/* ─── Auto-hide duration (ms) ─── */
const AUTO_HIDE_MS = 5_000

/* ─── Store interface ─── */

interface HudStore {
  /* Visibility */
  visible: boolean
  exiting: boolean
  show: () => void
  hide: () => void
  toggle: () => void

  /* Content */
  mode: HudMode
  title: string
  subtitle: string
  items: RankedItem[]
  source: string
  setContent: (payload: {
    mode: HudMode
    title: string
    subtitle?: string
    items: RankedItem[]
    source?: string
  }) => void

  /* Timer */
  autoHideMs: number
  progress: number
  setProgress: (v: number) => void
}

/* ─── Store ─── */

export const useHudStore = create<HudStore>((set, get) => ({
  /* Visibility */
  visible: false,
  exiting: false,

  show() {
    set({ visible: true, exiting: false, progress: 0 })
  },

  hide() {
    set({ exiting: true })
    // Allow exit animation to play (300 ms) before unmounting
    setTimeout(() => set({ visible: false, exiting: false }), 320)
  },

  toggle() {
    const { visible, exiting } = get()
    if (visible && !exiting) {
      get().hide()
    } else if (!visible) {
      get().show()
    }
  },

  /* Content */
  mode: "champion",
  title: "",
  subtitle: "",
  items: [],
  source: "ARAMGG",

  setContent({ mode, title, subtitle, items, source }) {
    set({
      mode,
      title,
      subtitle: subtitle ?? "",
      items,
      source: source ?? "ARAMGG",
    })
  },

  /* Timer */
  autoHideMs: AUTO_HIDE_MS,
  progress: 0,
  setProgress(v) {
    set({ progress: v })
  },
}))
