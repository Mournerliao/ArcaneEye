import type { ReactNode } from "react"

/* ─── Ranked data items ─── */

export interface RankedItem {
  rank: number
  name: string
  winRate: number
  /** Optional delta vs. average — positive = above avg */
  delta?: number
}

/* ─── HUD mode ─── */

export type HudMode = "champion" | "hex"

/* ─── HUD state ─── */

export interface HudState {
  visible: boolean
  mode: HudMode
  title: string
  subtitle?: string
  items: RankedItem[]
  /** Milliseconds remaining before auto-hide */
  timeLeft: number
  /** Data source label shown in footer */
  source: string
}

/* ─── Component prop helpers ─── */

export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}
