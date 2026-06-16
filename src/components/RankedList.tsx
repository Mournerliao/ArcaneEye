import { motion } from "motion/react"
import type { RankedItem } from "@/types"

interface RankedListProps {
  items: RankedItem[]
}

/**
 * Ranked data list with staggered entrance animation.
 *
 * Each item fades in + slides up with a 50 ms stagger,
 * per DESIGN.md "Data reveal" spec.
 */
export function RankedList({ items }: RankedListProps) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, i) => (
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

/* ── Single row ── */

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
      className={`group flex items-center gap-3 rounded-sm px-3 transition-colors ${
        isFirst
          ? "border border-primary/20 bg-primary/8 py-2.5 shadow-glow"
          : "py-2 hover:bg-surface-2"
      }`}
    >
      {/* Rank */}
      <span
        className={`w-5 shrink-0 text-center font-mono font-bold ${
          isFirst ? "text-base text-accent" : "text-sm text-primary"
        }`}
      >
        {item.rank}
      </span>

      {/* Name + bar */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate leading-tight ${
            isFirst
              ? "text-base font-semibold text-accent"
              : "text-sm text-ink"
          }`}
        >
          {item.name}
        </p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full ${
              isFirst ? "bg-accent" : "bg-primary"
            }`}
            style={{ width: barWidth }}
          />
        </div>
      </div>

      {/* Win rate */}
      <span
        className={`shrink-0 font-mono tabular-nums ${
          isFirst
            ? "text-lg font-bold text-accent"
            : isTop
              ? "text-base font-bold text-primary"
              : "text-base text-muted"
        }`}
      >
        {item.winRate.toFixed(1)}%
      </span>
    </div>
  )
}
