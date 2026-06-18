import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "cyan" | "gold"

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
        document.documentElement.dataset.theme = theme === "cyan" ? "" : theme
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
          document.documentElement.dataset.theme =
            state.theme === "cyan" ? "" : state.theme
        }
      },
    },
  ),
)
