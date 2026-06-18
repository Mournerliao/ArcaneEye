import { useEffect } from 'react'

interface KeyboardModifiers {
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
  meta?: boolean
}

/**
 * 注册全局键盘快捷键
 * @param key - 按键（不区分大小写）
 * @param callback - 触发回调
 * @param modifiers - 修饰键组合
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: KeyboardModifiers = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keyMatch = e.key.toLowerCase() === key.toLowerCase()
      const altMatch = modifiers.alt ? e.altKey : !e.altKey
      const ctrlMatch = modifiers.ctrl ? e.ctrlKey : !e.ctrlKey
      const shiftMatch = modifiers.shift ? e.shiftKey : !e.shiftKey
      const metaMatch = modifiers.meta ? e.metaKey : !e.metaKey

      if (keyMatch && altMatch && ctrlMatch && shiftMatch && metaMatch) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, modifiers.alt, modifiers.ctrl, modifiers.shift, modifiers.meta])
}
