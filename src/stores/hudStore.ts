// Compatibility layer - re-exports from split stores
// This file maintains backward compatibility while the codebase migrates

export { useHudVisibility, EXIT_ANIMATION_MS, EXIT_ANIMATION_BUFFER_MS } from './hudVisibility'
export { useHudContent } from './hudContent'

// Re-export useHudStore as an alias for useHudVisibility for backward compatibility
export { useHudVisibility as useHudStore } from './hudVisibility'
