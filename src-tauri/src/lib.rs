use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::{sync::Mutex, time::Duration};
use tauri::Manager;

const API_WORKBENCH_WORKSPACE_ID: &str = "default";
const API_WORKBENCH_SCHEMA_VERSION: i64 = 1;

struct ApiWorkbenchSqliteState {
  connection: Mutex<Connection>,
}

#[derive(Serialize)]
struct ApiWorkbenchSqliteLoadResult {
  workspace: Option<String>,
}

#[derive(Deserialize)]
struct ApiWorkbenchHttpHeaderInput {
  key: String,
  value: String,
}

#[derive(Deserialize)]
struct ApiWorkbenchHttpRequestInput {
  url: String,
  method: String,
  headers: Vec<ApiWorkbenchHttpHeaderInput>,
  body: Option<String>,
  timeout_ms: Option<u64>,
}

#[derive(Serialize)]
struct ApiWorkbenchHttpResponseHeader {
  key: String,
  value: String,
}

#[derive(Serialize)]
struct ApiWorkbenchHttpResponseOutput {
  status: u16,
  status_text: String,
  headers: Vec<ApiWorkbenchHttpResponseHeader>,
  body: String,
  duration_ms: u128,
}

fn initialize_api_workbench_database(connection: &Connection) -> rusqlite::Result<()> {
  connection.execute_batch(
    "
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS api_workbench_workspace_documents (
      id TEXT PRIMARY KEY,
      schema_version INTEGER NOT NULL,
      workspace_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    ",
  )
}

#[tauri::command]
fn api_workbench_sqlite_load(
  state: tauri::State<'_, ApiWorkbenchSqliteState>,
) -> Result<ApiWorkbenchSqliteLoadResult, String> {
  let connection = state
    .connection
    .lock()
    .map_err(|_| "Could not lock API workbench SQLite connection.".to_string())?;

  let workspace = connection
    .query_row(
      "SELECT workspace_json FROM api_workbench_workspace_documents WHERE id = ?1",
      params![API_WORKBENCH_WORKSPACE_ID],
      |row| row.get::<_, String>(0),
    )
    .map(Some)
    .or_else(|error| match error {
      rusqlite::Error::QueryReturnedNoRows => Ok(None),
      other => Err(other),
    })
    .map_err(|error| format!("Could not load API workbench workspace: {error}"))?;

  Ok(ApiWorkbenchSqliteLoadResult { workspace })
}

#[tauri::command]
fn api_workbench_sqlite_save(
  state: tauri::State<'_, ApiWorkbenchSqliteState>,
  workspace: String,
) -> Result<(), String> {
  let connection = state
    .connection
    .lock()
    .map_err(|_| "Could not lock API workbench SQLite connection.".to_string())?;

  connection
    .execute(
      "
      INSERT INTO api_workbench_workspace_documents (
        id,
        schema_version,
        workspace_json,
        created_at,
        updated_at
      )
      VALUES (?1, ?2, ?3, datetime('now'), datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        schema_version = excluded.schema_version,
        workspace_json = excluded.workspace_json,
        updated_at = datetime('now')
      ",
      params![
        API_WORKBENCH_WORKSPACE_ID,
        API_WORKBENCH_SCHEMA_VERSION,
        workspace
      ],
    )
    .map_err(|error| format!("Could not save API workbench workspace: {error}"))?;

  Ok(())
}

#[tauri::command]
fn api_workbench_sqlite_reset(
  state: tauri::State<'_, ApiWorkbenchSqliteState>,
) -> Result<(), String> {
  let connection = state
    .connection
    .lock()
    .map_err(|_| "Could not lock API workbench SQLite connection.".to_string())?;

  connection
    .execute(
      "DELETE FROM api_workbench_workspace_documents WHERE id = ?1",
      params![API_WORKBENCH_WORKSPACE_ID],
    )
    .map_err(|error| format!("Could not reset API workbench workspace: {error}"))?;

  Ok(())
}

#[tauri::command]
async fn api_workbench_http_send(
  request: ApiWorkbenchHttpRequestInput,
) -> Result<ApiWorkbenchHttpResponseOutput, String> {
  let method = reqwest::Method::from_bytes(request.method.as_bytes())
    .map_err(|error| format!("Invalid HTTP method: {error}"))?;
  let client = reqwest::Client::new();
  let mut builder = client.request(method, request.url);

  if let Some(timeout_ms) = request.timeout_ms {
    builder = builder.timeout(Duration::from_millis(timeout_ms));
  }

  for header in request.headers {
    builder = builder.header(header.key, header.value);
  }

  if let Some(body) = request.body {
    builder = builder.body(body);
  }

  let started_at = std::time::Instant::now();
  let response = builder
    .send()
    .await
    .map_err(|error| format!("HTTP request failed: {error}"))?;
  let status = response.status();
  let headers = response
    .headers()
    .iter()
    .map(|(key, value)| ApiWorkbenchHttpResponseHeader {
      key: key.to_string(),
      value: value.to_str().unwrap_or_default().to_string(),
    })
    .collect::<Vec<_>>();
  let body = response
    .text()
    .await
    .map_err(|error| format!("Could not read HTTP response body: {error}"))?;

  Ok(ApiWorkbenchHttpResponseOutput {
    status: status.as_u16(),
    status_text: status.canonical_reason().unwrap_or_default().to_string(),
    headers,
    body,
    duration_ms: started_at.elapsed().as_millis(),
  })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("Could not resolve app data directory: {error}"))?;
      std::fs::create_dir_all(&app_data_dir)
        .map_err(|error| format!("Could not create app data directory: {error}"))?;
      let database_path = app_data_dir.join("api-workbench.sqlite");
      let connection = Connection::open(database_path)
        .map_err(|error| format!("Could not open API workbench SQLite database: {error}"))?;
      initialize_api_workbench_database(&connection)
        .map_err(|error| format!("Could not initialize API workbench SQLite database: {error}"))?;
      app.manage(ApiWorkbenchSqliteState {
        connection: Mutex::new(connection),
      });

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      api_workbench_http_send,
      api_workbench_sqlite_load,
      api_workbench_sqlite_save,
      api_workbench_sqlite_reset
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
