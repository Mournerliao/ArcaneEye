use super::ScreenCapture;
use xcap::Monitor;

/// SDR capture backend using xcap (DXGI on Windows).
///
/// This is the default capture strategy. For HDR scenarios,
/// a future `HdrCapture` implementing `ScreenCapture` can use
/// an HTTP API to an external HDR capture tool.
pub struct SdrCapture;

impl ScreenCapture for SdrCapture {
    fn capture(&self) -> Result<Vec<u8>, String> {
        let monitors = Monitor::all().map_err(|e| format!("Failed to list monitors: {e}"))?;

        let monitor = monitors
            .into_iter()
            .find(|m| m.is_primary().unwrap_or(false))
            .ok_or_else(|| "No primary monitor found".to_string())?;

        let image = monitor
            .capture_image()
            .map_err(|e| format!("Screen capture failed: {e}"))?;

        let mut buf = std::io::Cursor::new(Vec::new());
        image
            .write_to(&mut buf, xcap::image::ImageFormat::Png)
            .map_err(|e| format!("PNG encoding failed: {e}"))?;

        Ok(buf.into_inner())
    }
}
