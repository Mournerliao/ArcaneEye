import { useCallback } from "react"
import { motion } from "motion/react"
import { SettingsIcon, SunIcon, LayersIcon, ZapIcon } from "lucide-react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useThemeStore } from "@/stores/themeStore"
import { Button } from "@/components/ui/button"

interface IdleScreenProps {
  onLoadChampions: () => void
  onLoadHex: () => void
  onOpenSettings: () => void
}

export function IdleScreen({ onLoadChampions, onLoadHex, onOpenSettings }: IdleScreenProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    getCurrentWindow().startDragging()
  }, [])

  return (
    <div className="tauri-window-surface relative flex items-center justify-center bg-bg">
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

      {/* Drag handle — top center */}
      <motion.div
        className="absolute top-2 left-1/2 z-20 -translate-x-1/2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex h-6 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20">
          <div className="h-1 w-5 rounded-full bg-primary/40" />
        </div>
      </motion.div>

      {/* Settings gear — top-left corner */}
      <motion.div
        className="absolute top-5 left-5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          aria-label="AI 设置"
        >
          <SettingsIcon data-icon="inline-start" />
          设置
        </Button>
      </motion.div>

      {/* Theme toggle — top-right corner */}
      <motion.div
        className="absolute top-5 right-5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label="切换主题"
        >
          <SunIcon data-icon="inline-start" />
          {theme === "cyan" ? "海克斯青" : "海克斯金"}
        </Button>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Hextech icon with glow */}
        <motion.div
          className="glow-pulse flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10"
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
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
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
          <Button variant="outline" onClick={onLoadChampions}>
            <LayersIcon data-icon="inline-start" className="text-primary" />
            英雄胜率
          </Button>
          <Button variant="outline" onClick={onLoadHex}>
            <ZapIcon data-icon="inline-start" className="text-accent" />
            海克斯推荐
          </Button>
        </motion.div>

        {/* Shortcut hint */}
        <motion.div
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            Alt
          </kbd>
          <span>+</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            Q
          </kbd>
          <span className="ml-1">唤起 / 关闭</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
