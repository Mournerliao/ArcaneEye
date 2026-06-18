import { motion } from "motion/react"
import { useThemeStore } from "@/stores/themeStore"

interface IdleScreenProps {
  onLoadChampions: () => void
  onLoadHex: () => void
  onOpenSettings: () => void
}

export function IdleScreen({ onLoadChampions, onLoadHex, onOpenSettings }: IdleScreenProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

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

      {/* Settings gear — top-left corner */}
      <motion.button
        onClick={onOpenSettings}
        className="absolute top-5 left-5 z-20 flex items-center gap-1.5 rounded-panel border border-surface-2 bg-surface/60 px-2.5 py-1.5 text-xs text-muted backdrop-blur-sm transition-all hover:border-primary/30 hover:text-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        aria-label="AI 设置"
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
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        设置
      </motion.button>

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
            onClick={onLoadChampions}
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
            onClick={onLoadHex}
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
