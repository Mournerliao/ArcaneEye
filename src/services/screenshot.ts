import { invoke } from "@tauri-apps/api/core"

/**
 * Capture the primary monitor screen.
 *
 * Returns a base64-encoded PNG data URL (`data:image/png;base64,...`)
 * that can be used as an `<img>` src or sent to a multimodal AI API.
 */
export async function captureScreen(): Promise<string> {
  return invoke<string>("capture_screen")
}
