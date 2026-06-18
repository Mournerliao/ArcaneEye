import { create } from "zustand"

/* ─── Animation timing constants ─── */
export const EXIT_ANIMATION_MS = 300
export const EXIT_ANIMATION_BUFFER_MS = 20

/* ─── Store interface ─── */

interface HudVisibilityStore {
  visible: boolean
  exiting: boolean
  show: () => void
  hide: () => void
  toggle: () => void
}

/* ─── Store ─── */

export const useHudVisibility = create<HudVisibilityStore>((set, get) => ({
  visible: false,
  exiting: false,

  show() {
    set({ visible: true, exiting: false })
  },

  hide() {
    set({ exiting: true })
    setTimeout(() => set({ visible: false, exiting: false }), EXIT_ANIMATION_MS + EXIT_ANIMATION_BUFFER_MS)
  },

  toggle() {
    const { visible, exiting } = get()
    if (visible && !exiting) {
      get().hide()
    } else if (!visible) {
      get().show()
    }
  },
}))
