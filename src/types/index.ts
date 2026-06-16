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
