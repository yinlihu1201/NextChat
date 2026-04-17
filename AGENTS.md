# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-17
**Commit:** c3b8c158
**Branch:** main

## OVERVIEW
NextChat - Light and Fast AI Assistant (Next.js 14 + TypeScript + Tauri desktop app). Supports Claude, DeepSeek, GPT4, Gemini Pro with streaming, prompts (masks), plugins, and MCP.

## STRUCTURE
```
NextChat/
├── app/                 # Next.js App Router source
│   ├── components/      # React components (20+)
│   ├── store/           # Zustand state stores (8)
│   ├── utils/           # Utility functions (25+)
│   ├── locales/         # i18n translations (15+)
│   ├── styles/          # SCSS styles
│   ├── config/          # Server/config layer
│   └── masks/           # Prompt templates
├── src-tauri/           # Tauri desktop app (Rust)
├── test/                # Jest tests
├── public/              # Static assets
└── docs/                # Documentation
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add component | app/components/ | TSX + .module.scss |
| State management | app/store/ | Zustand stores |
| API/client logic | app/utils/ | token, model, stream utils |
| i18n | app/locales/ | One file per language |
| Desktop app | src-tauri/ | Rust entry point |
| Run tests | test/ | Jest test files |
| Add model | app/utils/model.ts | Model config + providers |

## CONVENTIONS
- ESLint: next/core-web-vitals + prettier + unused-imports
- Styling: SCSS modules (`.module.scss`)
- State: Zustand with `create()`
- i18n: Separate locale file per language in app/locales/
- Components: Named exports, colocation with styles

## ANTI-PATTERNS (THIS PROJECT)
- DON'T use react-router-dom with Next.js App Router (conflicts with Next.js routing)
- DON'T skip baseUrl in tsconfig when using path aliases (broken @/* resolution)

## UNIQUE STYLES
- Dual entry: Web UI (app/) + Desktop (src-tauri/)
- Prompt masks system: app/masks/ for custom prompts
- Plugin system: app/components/plugin.tsx
- MCP support via @modelcontextprotocol/sdk

## COMMANDS
```bash
yarn dev          # Web dev server
yarn build        # Standalone production build
yarn app:dev      # Tauri desktop dev
yarn app:build    # Build desktop app
yarn test         # Run Jest tests
yarn lint         # ESLint check
```

## NOTES
- tsconfig missing baseUrl for @/* paths - may need fixing
- next.config.js not present - uses defaults
- Uses react-router-dom unusually (check if needed)
