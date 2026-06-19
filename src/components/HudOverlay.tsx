import { type CSSProperties } from "react"
import { motion } from "motion/react"
import { XIcon } from "lucide-react"
import { useHudVisibility, EXIT_ANIMATION_MS } from "@/stores/hudVisibility"
import { useHudContent } from "@/stores/hudContent"
import { useRankingDataStore } from "@/stores/rankingData"
import { useAutoHide } from "@/hooks/useAutoHide"
import { RankedList } from "@/components/RankedList"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

/* ── Entrance / exit animation variants ── */
const panelVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
      opacity: { duration: 0.15, ease: "easeOut" as const },
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: EXIT_ANIMATION_MS / 1000, ease: [0.7, 0, 0.84, 0] as const },
  },
}

interface HudOverlayProps {
  onHidden: () => void
  onRetry: () => void
}

export function HudOverlay({ onHidden, onRetry }: HudOverlayProps) {
  const { exiting } = useHudVisibility()
  const hide = useHudVisibility((s) => s.hide)
  const { mode, title, subtitle, source } = useHudContent()
  const { progress } = useAutoHide()

  const championItems = useRankingDataStore((s) => s.championItems)
  const hexItems = useRankingDataStore((s) => s.hexItems)
  const loading = useRankingDataStore((s) => s.loading)
  const error = useRankingDataStore((s) => s.error)

  const currentItems = mode === "champion" ? championItems : hexItems

  /* ── Data panel content ── */
  const panelContent = (() => {
    if (loading) {
      return (
        <div className="flex flex-col gap-2.5 py-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="size-4 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-1 w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="text-2xl opacity-40">⚠</span>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
          >
            重试
          </Button>
        </div>
      )
    }

    if (currentItems.length === 0) {
      const icon = mode === "champion" ? "🔮" : "⚡"
      const msg = mode === "champion" ? "暂无英雄数据" : "暂无海克斯数据"
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-2xl opacity-30">{icon}</span>
          <p className="mt-2 text-sm text-muted-foreground">{msg}</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-[2rem_minmax(0,1fr)_5.25rem] gap-3 px-3 text-[10px] leading-none text-muted-foreground">
          <span>排名</span>
          <span>名称</span>
          <span className="text-right">胜率</span>
        </div>
        <RankedList items={currentItems} maxItems={10} />
      </div>
    )
  })()

  return (
    <motion.div
      className="tauri-window-surface pointer-events-auto fixed inset-0 z-50 flex flex-col bg-surface shadow-glow"
      style={
        {
          "--progress": progress,
        } as CSSProperties
      }
      variants={panelVariants}
      initial="hidden"
      animate={exiting ? "exit" : "visible"}
      onAnimationComplete={() => {
        if (exiting) onHidden()
      }}
    >
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold leading-tight text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={hide} aria-label="关闭">
          <XIcon />
        </Button>
      </header>

      {/* Body — data list */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{panelContent}</main>

      {/* Footer — source attribution + auto-hide progress bar */}
      <footer className="shrink-0 border-t border-border px-5 py-2.5">
        <p className="mb-2 text-[10px] text-accent">数据来源：{source}</p>
        <Progress value={(1 - progress) * 100} />
      </footer>
    </motion.div>
  )
}
