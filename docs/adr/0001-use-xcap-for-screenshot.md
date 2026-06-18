# 0001 — Use xcap for screen capture

选用 `xcap` (v0.9.6) 作为 Rust 侧截图库。`screenshots` crate 已废弃，原作者明确指向 xcap 作为继任者。xcap 活跃维护（2026-05 最新发布），942 GitHub stars，跨平台支持 Windows/macOS/Linux，API 简洁（`Monitor::capture_image()` 返回 PNG 字节）。Windows 底层使用 DXGI，性能可靠。备选方案 `win-screenshot` 仅支持 Windows，`sc-cap` 过于年轻（仅 2 个版本）。
