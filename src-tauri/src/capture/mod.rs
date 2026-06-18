use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use xcap::Monitor;

/// Capture the primary monitor and return a base64-encoded PNG data URL.
///
/// Returns a string like `data:image/png;base64,iVBOR...` that can be used
/// directly as an `<img>` src or sent to a multimodal API.
pub fn capture_primary_monitor() -> Result<String, String> {
    let monitors = Monitor::all().map_err(|e| format!("Failed to list monitors: {e}"))?;

    let monitor = monitors
        .into_iter()
        .find(|m| m.is_primary().unwrap_or(false))
        .ok_or_else(|| "No primary monitor found".to_string())?;

    let image = monitor
        .capture_image()
        .map_err(|e| format!("Screen capture failed: {e}"))?;

    // Encode to PNG in memory
    let mut buf = std::io::Cursor::new(Vec::new());
    image
        .write_to(&mut buf, xcap::image::ImageFormat::Png)
        .map_err(|e| format!("PNG encoding failed: {e}"))?;

    let b64 = BASE64.encode(buf.into_inner());
    Ok(format!("data:image/png;base64,{b64}"))
}
