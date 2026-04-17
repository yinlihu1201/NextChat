# src-tauri/

Tauri desktop app (Rust backend).

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Desktop entry | src-tauri/src/main.rs |
| Stream handling | src-tauri/src/stream.rs |
| Desktop config | src-tauri/tauri.conf.json |

## COMMANDS
```bash
yarn app:dev      # Desktop dev
yarn app:build    # Build .exe/.app
```

## CONVENTIONS
- Rust backend for native features
- Tauri v1 (based on @tauri-apps/cli 1.5.11)
