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

/* ─── AI Provider config ─── */

export type AIProvider = "openai" | "anthropic" | "google" | "custom"

export interface ProviderConfig {
  name: string
  baseURL: string
  models: string[]
  defaultModel: string
}

export const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  openai: {
    name: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini"],
    defaultModel: "gpt-4o",
  },
  anthropic: {
    name: "Anthropic",
    baseURL: "https://api.anthropic.com/v1",
    models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022"],
    defaultModel: "claude-sonnet-4-20250514",
  },
  google: {
    name: "Google",
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-2.5-flash", "gemini-2.5-pro"],
    defaultModel: "gemini-2.5-flash",
  },
  custom: {
    name: "自定义",
    baseURL: "",
    models: [],
    defaultModel: "",
  },
}
