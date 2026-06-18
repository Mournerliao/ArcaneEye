import { useState, useEffect, useCallback } from "react"
import { motion } from "motion/react"
import { useAIConfigStore } from "@/stores/aiConfig"
import { PROVIDER_CONFIGS } from "@/types"
import type { AIProvider } from "@/types"

interface SettingsPageProps {
  onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const {
    provider,
    baseURL,
    modelId,
    setProvider,
    setBaseURL,
    setModelId,
    loadApiKey,
    saveApiKey,
  } = useAIConfigStore()

  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localKey, setLocalKey] = useState("")

  /* Load API key from Keychain on mount */
  useEffect(() => {
    loadApiKey().then(() => {
      const store = useAIConfigStore.getState()
      setLocalKey(store.apiKey)
    })
  }, [loadApiKey])

  /* When provider changes, auto-fill baseURL and modelId */
  const handleProviderChange = useCallback(
    (p: AIProvider) => {
      setProvider(p)
      const config = PROVIDER_CONFIGS[p]
      setBaseURL(config.baseURL)
      setModelId(config.defaultModel)
      // Reload API key for the new provider
      loadApiKey().then(() => {
        const store = useAIConfigStore.getState()
        setLocalKey(store.apiKey)
      })
    },
    [setProvider, setBaseURL, setModelId, loadApiKey],
  )

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      if (localKey.trim()) {
        await saveApiKey(localKey.trim())
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }, [localKey, saveApiKey])

  const currentConfig = PROVIDER_CONFIGS[provider]
  const isCustom = provider === "custom"

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-bg">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 45%, var(--c-primary) 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />
      <div className="hex-grid-bg pointer-events-none absolute inset-0" />

      <motion.div
        className="relative z-10 flex h-full w-full flex-col gap-4 overflow-y-auto px-6 py-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-panel border border-surface-2 bg-surface/60 px-2.5 py-1.5 text-xs text-muted backdrop-blur-sm transition-all hover:border-primary/30 hover:text-ink"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h2 className="text-sm font-semibold text-ink">AI 设置</h2>
          <div className="w-14" />
        </div>

        {/* Provider */}
        <FieldGroup label="Provider">
          <select
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
            className="w-full rounded-panel border border-surface-2 bg-surface px-3 py-2 text-sm text-ink outline-none transition-all focus:border-primary/50 focus:shadow-glow"
          >
            {Object.entries(PROVIDER_CONFIGS).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.name}
              </option>
            ))}
          </select>
        </FieldGroup>

        {/* API Key */}
        <FieldGroup label="API Key">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-panel border border-surface-2 bg-surface px-3 py-2 pr-16 font-mono text-sm text-ink outline-none placeholder:text-muted/50 transition-all focus:border-primary/50 focus:shadow-glow"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm px-2 py-0.5 text-[10px] text-muted transition-colors hover:text-ink"
            >
              {showKey ? "隐藏" : "显示"}
            </button>
          </div>
        </FieldGroup>

        {/* Base URL */}
        <FieldGroup label="Base URL">
          <input
            type="text"
            value={baseURL}
            onChange={(e) => setBaseURL(e.target.value)}
            placeholder="https://api.openai.com/v1"
            disabled={!isCustom}
            className="w-full rounded-panel border border-surface-2 bg-surface px-3 py-2 font-mono text-sm text-ink outline-none placeholder:text-muted/50 transition-all focus:border-primary/50 focus:shadow-glow disabled:opacity-40"
          />
          {!isCustom && (
            <p className="mt-1 text-[10px] text-muted">切换到"自定义"可编辑</p>
          )}
        </FieldGroup>

        {/* Model */}
        <FieldGroup label="Model">
          {isCustom || currentConfig.models.length === 0 ? (
            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder="gpt-4o"
              className="w-full rounded-panel border border-surface-2 bg-surface px-3 py-2 font-mono text-sm text-ink outline-none placeholder:text-muted/50 transition-all focus:border-primary/50 focus:shadow-glow"
            />
          ) : (
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full rounded-panel border border-surface-2 bg-surface px-3 py-2 text-sm text-ink outline-none transition-all focus:border-primary/50 focus:shadow-glow"
            >
              {currentConfig.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </FieldGroup>

        {/* Status messages */}
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
        {saved && (
          <p className="text-xs text-success">已保存</p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-auto rounded-panel border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-primary hover:bg-primary/15 hover:shadow-glow disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存配置"}
        </button>
      </motion.div>
    </div>
  )
}

/* ─── Reusable field group ─── */

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </label>
      {children}
    </div>
  )
}
