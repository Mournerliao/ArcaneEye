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
import { Separator } from "@/components/ui/separator"

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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            aria-label="返回主界面"
          >
            <ArrowLeftIcon data-icon="inline-start" />
            返回
          </Button>
          <h2 className="text-sm font-semibold text-ink">AI 设置</h2>
          <div className="w-14" />
        </div>

        {/* ── Section 1: Provider + Model ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            服务商配置
          </p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">服务商</Label>
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
            <Label className="text-xs font-medium text-muted-foreground">模型</Label>
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
        </section>

        <Separator />

        {/* ── Section 2: API Key ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            认证
          </p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">密钥</Label>
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
                  {showKey ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </section>

        <Separator />

        {/* ── Section 3: Advanced (Base URL) ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            高级设置
          </p>
          <div className={cn("flex flex-col gap-1.5", !isCustom && "opacity-60")}>
            <Label className="text-xs font-medium text-muted-foreground">接口地址</Label>
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
              <p className="text-[11px] text-muted-foreground">切换到"自定义"可编辑</p>
            )}
          </div>
        </section>

        {/* Error message */}
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

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="mt-auto"
          aria-label="保存配置"
        >
          {saving && <Spinner data-icon="inline-start" />}
          {saving ? "保存中..." : "保存配置"}
        </Button>
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
