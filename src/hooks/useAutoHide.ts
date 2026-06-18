import { useCallback, useEffect, useRef, useState } from "react"
import { useHudVisibility } from "@/stores/hudVisibility"

/* ─── Auto-hide duration (ms) ─── */
const AUTO_HIDE_MS = 5_000

/**
 * Drives the auto-hide countdown.
 *
 * Returns `{ progress }` (0 → 1) which the ProgressBar reads.
 * When progress reaches 1 the overlay is hidden automatically.
 *
 * All timer state is local — no global store pollution.
 */
export function useAutoHide() {
  const visible = useHudVisibility((s) => s.visible)
  const exiting = useHudVisibility((s) => s.exiting)
  const hide = useHudVisibility((s) => s.hide)

  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const needsResetRef = useRef(false)

  // Drive the countdown when overlay is active
  useEffect(() => {
    if (!visible || exiting) {
      cancelAnimationFrame(rafRef.current)
      needsResetRef.current = true
      return
    }

    startRef.current = performance.now()

    const tick = () => {
      // Reset progress on first tick after a hide/show cycle
      if (needsResetRef.current) {
        needsResetRef.current = false
        setProgress(0)
      }

      const elapsed = performance.now() - startRef.current
      const next = Math.min(elapsed / AUTO_HIDE_MS, 1)
      setProgress(next)

      if (next >= 1) {
        hide()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [visible, exiting, hide])

  /** Reset the countdown — call after updating content. */
  const reset = useCallback(() => {
    needsResetRef.current = false
    setProgress(0)
    startRef.current = performance.now()
  }, [])

  return { progress, reset }
}
