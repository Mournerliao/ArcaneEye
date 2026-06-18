import { useCallback, useEffect, useRef } from "react"
import { useHudVisibility } from "@/stores/hudVisibility"

/**
 * Drives the auto-hide countdown.
 *
 * Returns `{ progress }` (0 → 1) which the ProgressBar reads.
 * When progress reaches 1 the overlay is hidden automatically.
 */
export function useAutoHide() {
  const visible = useHudVisibility((s) => s.visible)
  const exiting = useHudVisibility((s) => s.exiting)
  const autoHideMs = useHudVisibility((s) => s.autoHideMs)
  const hide = useHudVisibility((s) => s.hide)

  const progress = useHudVisibility((s) => s.progress)
  const setProgress = useHudVisibility((s) => s.setProgress)

  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (!visible || exiting) {
      cancelAnimationFrame(rafRef.current)
      return
    }

    startRef.current = performance.now()

    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const next = Math.min(elapsed / autoHideMs, 1)
      setProgress(next)

      if (next >= 1) {
        hide()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [visible, exiting, autoHideMs, hide, setProgress])

  /** Reset the countdown — call after updating content. */
  const reset = useCallback(() => {
    setProgress(0)
    startRef.current = performance.now()
  }, [setProgress])

  return { progress, reset }
}
