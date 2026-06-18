import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useAIConfigStore } from "@/stores/aiConfig"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { PROVIDER_CONFIGS } from "@/types"
import type { AIProvider } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

interface SettingsPageProps {
  onClose: () => void
}

interface FormSnapshot {
  provider: AIProvider
  baseURL: string
  modelId: string
  apiKey: string
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
  const [error, setError] = useState<string | null>(null)
  const [localKey, setLocalKey] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [snapshot, setSnapshot] = useState<FormSnapshot | null>(null)

  const isDirty = useMemo(() => {
    if (!snapshot) return false
    return (
      snapshot.provider !== provider ||
      snapshot.baseURL !== baseURL ||
      snapshot.modelId !== modelId ||
      snapshot.apiKey !== localKey
    )
  }, [snapshot, provider, baseURL, modelId, localKey])

  const takeSnapshot = useCallback(() => {
    setSnapshot({ provider, baseURL, modelId, apiKey: localKey })
  }, [provider, baseURL, modelId, localKey])

  useEffect(() => {
    loadApiKey().then(() => {
      const store = useAIConfigStore.getState()
      setLocalKey(store.apiKey)
      setTimeout(() => {
        setSnapshot({
          provider: useAIConfigStore.getState().provider,
          baseURL: useAIConfigStore.getState().baseURL,
          modelId: useAIConfigStore.getState().modelId,
          apiKey: store.apiKey,
        })
      }, 0)
    })
  }, [loadApiKey])

  const handleProviderChange = useCallback(
    (value: string | null) => {
      if (!value) return
      const p = value as AIProvider
      setProvider(p)
      const config = PROVIDER_CONFIGS[p]
      setBaseURL(config.baseURL)
      setModelId(config.defaultModel)
      const storedKey = useAIConfigStore.getState().apiKey
      if (localKey === storedKey || localKey === "") {
        loadApiKey().then(() => {
          const store = useAIConfigStore.getState()
          setLocalKey(store.apiKey)
        })
      }
    },
    [setProvider, setBaseURL, setModelId, loadApiKey, localKey],
  )

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      if (localKey.trim()) {
        await saveApiKey(localKey.trim())
      }
      takeSnapshot()
      toast.success("配置已保存")
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }, [localKey, saveApiKey, takeSnapshot])

  const handleBack = useCallback(() => {
    if (isDirty) {
      setShowConfirm(true)
    } else {
      onClose()
    }
  }, [isDirty, onClose])

  useKeyboardShortcut("Escape", handleBack)
  useKeyboardShortcut("s", handleSave, { ctrl: true })

  const currentConfig = PROVIDER_CONFIGS[provider]
  const isCustom = provider === "custom"

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-bg">
      {/* 背景光晕 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 45%, var(--c-primary) 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />
      {/* 六角网格 */}
      <div className="hex-grid-bg pointer-events-none absolute inset-0" />

      {/* 返回按钮 - 与主界面设置按钮同位置 (top-5 left-5) */}
      <motion.div
        className="absolute top-5 left-5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          aria-label="返回主界面"
        >
          <ArrowLeftIcon data-icon="inline-start" />
          返回
        </Button>
      </motion.div>

      {/* 表单内容 - 水平居中，垂直填满 */}
      <motion.div
        className="absolute inset-0 z-10 flex justify-center px-5 pt-14 pb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="settings-glass-panel flex h-full w-full max-w-[400px] flex-col overflow-y-auto">
          {/* 标题 */}
          <div className="flex items-center justify-center px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">AI 设置</h2>
          </div>

          {/* 分隔线 */}
          <div className="settings-divider mx-5" />

          {/* Form body */}
          <div className="flex flex-1 flex-col gap-5 px-5 py-4">
            {/* Provider + Model */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-primary/80">
                服务商配置
              </p>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-ink">服务商</Label>
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger className="w-full" aria-label="选择 AI 服务商">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(PROVIDER_CONFIGS).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>
                          {cfg.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-ink">模型</Label>
                {isCustom || currentConfig.models.length === 0 ? (
                  <Input
                    type="text"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    placeholder="gpt-4o"
                    aria-label="模型名称"
                    className="font-mono"
                  />
                ) : (
                  <Select value={modelId} onValueChange={(v) => v && setModelId(v)}>
                    <SelectTrigger className="w-full" aria-label="选择模型">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {currentConfig.models.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="settings-divider" />

            {/* API Key */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-primary/80">
                认证
              </p>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-ink">密钥</Label>
                <InputGroup>
                  <InputGroupInput
                    type={showKey ? "text" : "password"}
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    placeholder="sk-..."
                    aria-label="API 密钥"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setShowKey(!showKey)}
                      aria-label={showKey ? "隐藏密钥" : "显示密钥"}
                      aria-pressed={showKey}
                    >
                      {showKey ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="settings-divider" />

            {/* Advanced: Base URL */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-primary/80">
                高级设置
              </p>
              <div className={cn("flex flex-col gap-1.5", !isCustom && "opacity-50")}>
                <Label className="text-xs text-ink">接口地址</Label>
                <Input
                  type="text"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  disabled={!isCustom}
                  aria-label="API 接口地址"
                  className="font-mono"
                />
                {!isCustom && (
                  <p className="text-[11px] text-muted">切换到"自定义"可编辑</p>
                )}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with save */}
          <div className="settings-divider mx-5" />
          <div className="px-5 py-4">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saving}
              className="w-full"
              aria-label="保存配置"
            >
              {saving && <Spinner data-icon="inline-start" />}
              {saving ? "保存中..." : "保存配置"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Confirm leave dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>未保存的更改</AlertDialogTitle>
            <AlertDialogDescription>
              有未保存的更改，确定离开？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>继续编辑</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onClose}>
              离开
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
