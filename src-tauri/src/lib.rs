/// ArcaneEye Tauri application entry point.
///
/// ArcaneEye runs a control window plus a dedicated transparent HUD window.
mod capture;
mod keychain;

use dpi::{PhysicalPosition, PhysicalSize, Position, Size};
use tauri::Manager;

const HUD_WINDOW_LABEL: &str = "hud";
const HUD_WINDOW_WIDTH: u32 = 320;
const HUD_WINDOW_HEIGHT: u32 = 480;
const HUD_SCREEN_EDGE_GAP: i32 = 24;

#[tauri::command]
fn capture_screen() -> Result<String, String> {
    capture::capture_primary_monitor()
}

fn calculate_hud_position(
    monitor_position: PhysicalPosition<i32>,
    monitor_size: PhysicalSize<u32>,
    hud_size: PhysicalSize<u32>,
    edge_gap: i32,
) -> PhysicalPosition<i32> {
    let x = monitor_position.x + monitor_size.width as i32 - hud_size.width as i32 - edge_gap;
    let y = monitor_position.y + (monitor_size.height as i32 - hud_size.height as i32) / 2;

    PhysicalPosition::new(x, y)
}

#[tauri::command]
fn show_hud_window(app: tauri::AppHandle) -> Result<(), String> {
    let hud = app
        .get_webview_window(HUD_WINDOW_LABEL)
        .ok_or_else(|| "hud window not found".to_string())?;
    let monitor = hud
        .primary_monitor()
        .map_err(|err| err.to_string())?
        .or_else(|| hud.current_monitor().ok().flatten())
        .ok_or_else(|| "primary monitor not found".to_string())?;
    let hud_size = PhysicalSize::new(HUD_WINDOW_WIDTH, HUD_WINDOW_HEIGHT);
    let position = calculate_hud_position(
        *monitor.position(),
        *monitor.size(),
        hud_size,
        HUD_SCREEN_EDGE_GAP,
    );

    hud.set_size(Size::Physical(hud_size))
        .map_err(|err| err.to_string())?;
    hud.set_position(Position::Physical(position))
        .map_err(|err| err.to_string())?;
    hud.set_always_on_top(true).map_err(|err| err.to_string())?;
    hud.show().map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
fn hide_hud_window(app: tauri::AppHandle) -> Result<(), String> {
    let hud = app
        .get_webview_window(HUD_WINDOW_LABEL)
        .ok_or_else(|| "hud window not found".to_string())?;

    hud.hide().map_err(|err| err.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            capture_screen,
            show_hud_window,
            hide_hud_window,
            keychain::save_api_key,
            keychain::get_api_key,
            keychain::delete_api_key
        ])
        .setup(|_app| {
            #[cfg(not(debug_assertions))]
            {
                let hud = _app
                    .get_webview_window(HUD_WINDOW_LABEL)
                    .expect("hud window not found");
                hud.set_ignore_cursor_events(true)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running ArcaneEye");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn positions_hud_at_screen_right_middle() {
        let position = calculate_hud_position(
            PhysicalPosition::new(0, 0),
            PhysicalSize::new(2560, 1440),
            PhysicalSize::new(320, 480),
            24,
        );

        assert_eq!(position, PhysicalPosition::new(2216, 480));
    }
}
