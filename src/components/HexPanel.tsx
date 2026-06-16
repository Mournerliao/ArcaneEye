import { useHudStore } from "@/stores/hudStore"
import { RankedList } from "@/components/RankedList"

/**
 * Hex augment recommendation list.
 * Shown when HUD mode is "hex".
 */
export function HexPanel() {
  const items = useHudStore((s) => s.items)

  if (items.length === 0) {
    return <EmptyState message="暂无海克斯数据" />
  }

  return <RankedList items={items} />
}

/* ── Empty state ── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-2xl opacity-30">⚡</span>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  )
}
