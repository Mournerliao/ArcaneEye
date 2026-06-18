import { create } from "zustand"
import type { HudMode, RankedItem } from "@/types"

/* ─── Store interface ─── */

interface HudContentStore {
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
}

/* ─── Store ─── */

export const useHudContent = create<HudContentStore>((set) => ({
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
}))
