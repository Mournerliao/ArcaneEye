import { motion } from "motion/react"
import type { RankedItem } from "@/types"
import { cn } from "@/lib/utils"

interface RankedListProps {
  items: RankedItem[]
  maxItems?: number
}

/**
 * Glanceable recommendation list.
 *
 * The HUD's primary job is letting the player read candidate names. Keep the
 * numeric columns narrow, and allow long augment names to wrap to two lines.
 */
export function RankedList({ items, maxItems = 5 }: RankedListProps) {
  const visibleItems = items.slice(0, maxItems)

  return (
    <ul className="flex flex-col gap-1.5">
      {visibleItems.map((item, i) => (
        <motion.li
          key={item.rank}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.15,
            delay: i * 0.05,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          <RankedRow item={item} isTop={i < 3} isFirst={i === 0} />
        </motion.li>
      ))}
    </ul>
  )
}

function RankedRow({
  item,
  isTop,
  isFirst,
}: {
  item: RankedItem
  isTop: boolean
  isFirst: boolean
}) {
  const barWidth = `${Math.max(0, Math.min(100, item.winRate - 40)) * (100 / 25)}%`

  return (
    <div
      className={cn(
        "relative grid min-h-[52px] grid-cols-[2rem_minmax(0,1fr)_5.25rem] items-center gap-3 rounded-sm px-3 py-2 transition-colors",
        isFirst
          ? "border border-primary/25 bg-primary/10 shadow-glow"
          : "hover:bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-sm font-mono text-base font-bold",
          isFirst
            ? "bg-accent/15 text-accent"
            : isTop
              ? "text-primary"
              : "text-muted-foreground",
        )}
      >
        {item.rank}
      </span>

      <div className="min-w-0">
        <p
          className={cn(
            "overflow-hidden text-sm leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
            isFirst
              ? "font-semibold text-accent"
              : isTop
                ? "font-medium text-ink"
                : "text-muted-foreground",
          )}
        >
          {item.name}
        </p>
      </div>

      <span
        className={cn(
          "text-right font-mono text-lg tabular-nums",
          isFirst
            ? "font-bold text-accent"
            : isTop
              ? "font-bold text-primary"
              : "text-muted-foreground",
        )}
      >
        {item.winRate.toFixed(1)}%
      </span>

      <span className="absolute bottom-1.5 left-[3.75rem] right-[6.75rem] h-1 overflow-hidden rounded-full bg-muted">
        <span
          className={cn("block h-full", isFirst ? "bg-accent" : "bg-primary")}
          style={{ width: barWidth }}
        />
      </span>
    </div>
  )
}
