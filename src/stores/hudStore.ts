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
  loading: boolean
  error: string | null
  setContent: (payload: {
    mode: HudMode
    title: string
    subtitle?: string
    items: RankedItem[]
    source?: string
  }) => void
  setLoading: (v: boolean) => void
  setError: (msg: string | null) => void

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
    set({ visible: true, exiting: false, progress: 0, error: null })
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
  loading: false,
  error: null,

  setContent({ mode, title, subtitle, items, source }) {
    set({
      mode,
      title,
      subtitle: subtitle ?? "",
      items,
      source: source ?? "ARAMGG",
      loading: false,
      error: null,
    })
  },

  setLoading(v) {
    set({ loading: v })
  },

  setError(msg) {
    set({ error: msg, loading: false })
  },

  /* Timer */
  autoHideMs: AUTO_HIDE_MS,
  progress: 0,
  setProgress(v) {
    set({ progress: v })
  },
}))
