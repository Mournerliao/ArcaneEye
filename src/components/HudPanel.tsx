import { type CSSProperties, useCallback, useEffect } from "react"
import { motion } from "motion/react"
import { useShallow } from "zustand/shallow"
import { useHudStore } from "@/stores/hudStore"
import { useAutoHide } from "@/hooks/useAutoHide"
import { RankedList } from "@/components/RankedList"
import { SAMPLE_CHAMPIONS, SAMPLE_HEX_AUGMENTS } from "@/services/placeholderData"

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
    transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const },
  },
}

export function HudPanel() {
  const { visible, exiting, mode, title, subtitle, source, items, loading, error } =
    useHudStore(
      useShallow((s) => ({
        visible: s.visible,
        exiting: s.exiting,
        mode: s.mode,
        title: s.title,
        subtitle: s.subtitle,
        source: s.source,
        items: s.items,
        loading: s.loading,
        error: s.error,
      })),
    )

  const show = useHudStore((s) => s.show)
  const hide = useHudStore((s) => s.hide)
  const setContent = useHudStore((s) => s.setContent)
  const toggle = useHudStore((s) => s.toggle)

  const { progress } = useAutoHide()

  /* ── Keyboard shortcut: Alt+Q ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "q") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggle])

  /* ── Demo: load placeholder data ── */
  const loadChampions = useCallback(() => {
    setContent({
      mode: "champion",
      title: "英雄胜率排名",
      subtitle: "大乱斗 · 当前版本",
      items: SAMPLE_CHAMPIONS,
    })
    show()
  }, [setContent, show])

  const loadHex = useCallback(() => {
    setContent({
      mode: "hex",
      title: "海克斯强化推荐",
      subtitle: "泽丽 · 大乱斗",
      items: SAMPLE_HEX_AUGMENTS,
    })
    show()
  }, [setContent, show])

  /* ── Idle state: show product intro ── */
  if (!visible) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-6 px-8 text-center">
          {/* Product icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/12 shadow-glow">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Product name + description */}
          <div>
            <h1 className="text-lg font-semibold text-ink">ArcaneEye</h1>
            <p className="mt-1 text-sm text-muted">
              大乱斗数据助手 · 实时胜率推荐
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={loadChampions}
              className="rounded-panel bg-surface-2 px-4 py-2 text-sm text-ink transition-colors hover:bg-primary hover:text-white"
            >
              英雄胜率
            </button>
            <button
              onClick={loadHex}
              className="rounded-panel bg-surface-2 px-4 py-2 text-sm text-ink transition-colors hover:bg-primary hover:text-white"
            >
              海克斯推荐
            </button>
          </div>

          <span className="text-xs text-muted">Alt+Q 唤起 / 关闭</span>
        </div>
      </div>
    )
  }

  /* ── Data panel content ── */
  const panelContent = (() => {
    if (loading) {
      return (
        <div className="flex flex-col gap-2.5 py-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <div className="h-4 w-5 animate-pulse rounded bg-surface-2" />
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
                <div className="mt-1 h-1 w-full animate-pulse rounded-full bg-surface-2" />
              </div>
              <div className="h-4 w-12 animate-pulse rounded bg-surface-2" />
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="text-2xl opacity-40">⚠</span>
          <p className="text-sm text-muted">{error}</p>
          <button
            onClick={loadChampions}
            className="rounded-sm bg-surface-2 px-3 py-1.5 text-xs text-ink transition-colors hover:bg-primary hover:text-white"
          >
            重试
          </button>
        </div>
      )
    }

    if (items.length === 0) {
      const icon = mode === "champion" ? "🔮" : "⚡"
      const msg = mode === "champion" ? "暂无英雄数据" : "暂无海克斯数据"
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-2xl opacity-30">{icon}</span>
          <p className="mt-2 text-sm text-muted">{msg}</p>
        </div>
      )
    }

    return <RankedList items={items} />
  })()

  /* ── Active HUD overlay ── */
  return (
    <motion.div
      className="pointer-events-auto fixed top-4 right-4 z-50 flex h-[min(480px,calc(100vh-32px))] w-[320px] flex-col overflow-hidden rounded-panel bg-surface shadow-glow"
      style={
        {
          "--progress": progress,
        } as CSSProperties
      }
      variants={panelVariants}
      initial="hidden"
      animate={exiting ? "exit" : "visible"}
      onAnimationComplete={() => {
        if (exiting) hide()
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-surface-2 px-4 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold leading-tight text-ink">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
          )}
        </div>
        <button
          onClick={hide}
          className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:text-accent"
          aria-label="关闭"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </header>

      {/* Body — data list */}
      <main className="flex-1 overflow-y-auto px-4 py-3">{panelContent}</main>

      {/* Footer — source attribution + auto-hide progress bar */}
      <footer className="border-t border-surface-2 px-4 py-2">
        <p className="mb-2 text-[10px] text-accent">
          数据来源：{source}
        </p>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary/40"
            style={{ width: `${(1 - progress) * 100}%` }}
          />
        </div>
      </footer>
    </motion.div>
  )
}
