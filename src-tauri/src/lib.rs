/// ArcaneEye Tauri application entry point.
///
/// In debug builds the overlay is fully interactive (clicks register) so
/// developer-tools and hot-reload work normally.
/// In release builds the overlay ignores cursor events (click-through) so
/// it never steals focus from the game.
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let _window = app
                .get_webview_window("main")
                .expect("main window not found");

            // Release builds: make the overlay click-through so it never
            // interrupts gameplay.
            #[cfg(not(debug_assertions))]
            _window.set_ignore_cursor_events(true)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running ArcaneEye");
}
