# app/

Next.js App Router source code (80+ files).

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| UI Components | app/components/ | TSX + .module.scss |
| State stores | app/store/ | Zustand |
| Utilities | app/utils/ | API, token, stream utils |
| i18n | app/locales/ | 15+ languages |
| Styles | app/styles/ | SCSS |
| Config | app/config/ | Server env wiring |

## CONVENTIONS
- Colocated styles: `Component.tsx` + `Component.module.scss`
- State: Zustand stores in app/store/
- Components: Named exports

## ANTI-PATTERNS
- DON'T mix react-router-dom with Next.js App Router
