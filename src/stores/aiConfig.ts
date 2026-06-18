import { create } from "zustand"
import { persist } from "zustand/middleware"
import { invoke } from "@tauri-apps/api/core"
import type { AIProvider } from "@/types"

/* ─── Store interface ─── */

interface AIConfigState {
  provider: AIProvider
  baseURL: string
  modelId: string
  apiKey: string

  setProvider: (provider: AIProvider) => void
  setBaseURL: (url: string) => void
  setModelId: (id: string) => void
  setApiKey: (key: string) => void

  /** Load API key from OS Keychain into memory */
  loadApiKey: () => Promise<void>
  /** Persist API key to OS Keychain */
  saveApiKey: (key: string) => Promise<void>
  /** Delete API key from OS Keychain */
  deleteApiKey: () => Promise<void>

  /** Check if API key exists in Keychain */
  hasApiKey: () => Promise<boolean>
}

/* ─── Store ─── */

export const useAIConfigStore = create<AIConfigState>()(
  persist(
    (set, get) => ({
      provider: "openai" as AIProvider,
      baseURL: "https://api.openai.com/v1",
      modelId: "gpt-4o",
      apiKey: "",

      setProvider(provider) {
        set({ provider })
      },

      setBaseURL(url) {
        set({ baseURL: url })
      },

      setModelId(id) {
        set({ modelId: id })
      },

      setApiKey(key) {
        set({ apiKey: key })
      },

      async loadApiKey() {
        try {
          const key = await invoke<string | null>("get_api_key", {
            provider: get().provider,
          })
          set({ apiKey: key ?? "" })
        } catch (err) {
          console.warn("[AIConfig] Failed to load API key:", err)
        }
      },

      async saveApiKey(key) {
        await invoke("save_api_key", {
          provider: get().provider,
          key,
        })
        set({ apiKey: key })
      },

      async deleteApiKey() {
        await invoke("delete_api_key", {
          provider: get().provider,
        })
        set({ apiKey: "" })
      },

      async hasApiKey() {
        try {
          const key = await invoke<string | null>("get_api_key", {
            provider: get().provider,
          })
          return key !== null && key.length > 0
        } catch {
          return false
        }
      },
    }),
    {
      name: "arcaneeye-ai-config",
      partialize: (state) => ({
        provider: state.provider,
        baseURL: state.baseURL,
        modelId: state.modelId,
        // apiKey is NOT persisted here — stored in OS Keychain
      }),
    },
  ),
)
