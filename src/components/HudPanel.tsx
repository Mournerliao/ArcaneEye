import { type CSSProperties, useCallback, useEffect } from "react"
import { motion } from "motion/react"
import { useShallow } from "zustand/shallow"
import { useHudStore } from "@/stores/hudStore"
import { useThemeStore } from "@/stores/themeStore"
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
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

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
      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-bg">
        {/* Background atmosphere */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 45%, var(--c-primary) 0%, transparent 70%)",
            opacity: 0.08,
          }}
        />
        <div className="hex-grid-bg pointer-events-none absolute inset-0" />

        {/* Theme toggle — top-right corner, out of the primary flow */}
        <motion.button
          onClick={toggleTheme}
          className="absolute top-5 right-5 z-20 flex items-center gap-1.5 rounded-panel border border-surface-2 bg-surface/60 px-2.5 py-1.5 text-xs text-muted backdrop-blur-sm transition-all hover:border-primary/30 hover:text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          aria-label="切换主题"
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
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          {theme === "cyan" ? "海克斯青" : "海克斯金"}
        </motion.button>

        {/* Main content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-8 px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Hextech icon with glow */}
          <motion.div
            className="glow-pulse flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 36 36"
              fill="none"
              className="text-primary"
            >
              <path
                d="M18 2L32.39 10.5V27.5L18 36L3.61 27.5V10.5L18 2Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M18 8L27.12 13.25V23.75L18 29L8.88 23.75V13.25L18 8Z"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.8" />
              <circle cx="18" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Branding */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              ArcaneEye
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
              大乱斗数据助手 · 实时胜率推荐
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex gap-3"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={loadChampions}
              className="group flex items-center gap-2 rounded-panel border border-primary/30 bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-primary hover:bg-primary/10 hover:shadow-glow"
            >
              <svg
                width="16"
                height="16"
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
              英雄胜率
            </button>
            <button
              onClick={loadHex}
              className="group flex items-center gap-2 rounded-panel border border-accent/30 bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-accent hover:bg-accent/10 hover:shadow-glow"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              海克斯推荐
            </button>
          </motion.div>

          {/* Shortcut hint */}
          <motion.div
            className="flex items-center gap-1.5 text-xs text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <kbd className="rounded border border-surface-2 bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">
              Alt
            </kbd>
            <span>+</span>
            <kbd className="rounded border border-surface-2 bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">
              Q
            </kbd>
            <span className="ml-1">唤起 / 关闭</span>
          </motion.div>
        </motion.div>
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
