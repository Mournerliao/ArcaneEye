import { useHudStore } from "@/stores/hudStore"
import { RankedList } from "@/components/RankedList"

/**
 * Champion win-rate ranked list.
 * Shown when HUD mode is "champion".
 */
export function ChampionPanel() {
  const items = useHudStore((s) => s.items)

  if (items.length === 0) {
    return <EmptyState message="暂无英雄数据" />
  }

  return <RankedList items={items} />
}

/* ── Empty state ── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-2xl opacity-30">🔮</span>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  )
}
