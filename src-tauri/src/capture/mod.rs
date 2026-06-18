mod sdr;

use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};

/// Trait abstracting screen capture backends.
///
/// Implementors capture the primary monitor and return raw PNG bytes.
/// The `ScreenCapture` trait creates a seam between SDR (xcap) and
/// future HDR backends (HTTP API).
pub trait ScreenCapture {
    /// Capture the primary monitor as raw PNG bytes.
    fn capture(&self) -> Result<Vec<u8>, String>;
}

/// Capture the primary monitor and return a base64-encoded PNG data URL.
///
/// Returns a string like `data:image/png;base64,iVBOR...` that can be used
/// directly as an `<img>` src or sent to a multimodal API.
pub fn capture_primary_monitor() -> Result<String, String> {
    let backend = sdr::SdrCapture;
    let png_bytes = backend.capture()?;
    let b64 = BASE64.encode(png_bytes);
    Ok(format!("data:image/png;base64,{b64}"))
}
