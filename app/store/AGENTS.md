# app/store/

Zustand state management (8 stores).

## STORES
| Store | Purpose |
|-------|---------|
| access.ts | API keys, auth settings |
| chat.ts | Chat messages, conversations |
| config.ts | App config, theme, language |
| mask.ts | Prompt masks/templates |
| plugin.ts | Plugin state |
| prompt.ts | System prompts |
| sd.ts | Stable Diffusion state |
| sync.ts | Cloud sync state |

## CONVENTIONS
- Use `create()` from zustand
- State persisted via zustand persist middleware

## ANTI-PATTERNS
- DON'T use React Context for global state (use Zustand)
