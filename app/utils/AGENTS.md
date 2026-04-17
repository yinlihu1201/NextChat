# app/utils/

Utility functions (25+ files).

## KEY FILES
| File | Purpose |
|------|---------|
| model.ts | Model config + providers |
| token.ts | Token counting |
| chat.ts | Chat API client |
| stream.ts | Stream handling |
| auth-settings-events.ts | Auth event handling |
| cloud/ | WebDAV, Upstash sync |

## CONVENTIONS
- Named exports
- Modular by concern

## ANTI-PATTERNS
- DON'T duplicate utilities across files
