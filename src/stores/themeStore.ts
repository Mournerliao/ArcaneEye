import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  applyThemeToDocument,
  emitThemeChanged,
  type Theme,
} from "@/services/themeSync"

export type { Theme }

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "cyan",

      setTheme(theme) {
        applyThemeToDocument(theme)
        void emitThemeChanged(theme)
        set({ theme })
      },

      toggleTheme() {
        const next = get().theme === "cyan" ? "gold" : "cyan"
        get().setTheme(next)
      },
    }),
    {
      name: "arcaneeye-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDocument(state.theme)
        }
      },
    },
  ),
)
