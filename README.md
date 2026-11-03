# Chatty

מערכת צ'אט תמיכה מקצועית – פשוטה, אלגנטית וממוקדת.

**Ver. 0.1.2 | Build 003 | 03.11.2026**

## מסמכים
| קובץ | תיאור |
|------|-------|
| [01-requirements-and-concept.md](./docs/01-requirements-and-concept.md) | דרישות וקונספט |
| [02-detailed-specification.md](./docs/02-detailed-specification.md) | איפיון מפורט |
| [03-architecture.md](./docs/03-architecture.md) | ארכיטקטורה ויזואלית |
| [04-technical-design.md](./docs/04-technical-design.md) | עיצוב טכני |
| [05-backlog-and-work-packages.md](./docs/05-backlog-and-work-packages.md) | Backlog + חבילות עבודה |

## מבנה
```
apps/web     → Next.js (Widget + Dashboard)
apps/api     → NestJS Backend
packages/shared → טיפוסים + גרסה
docker/      → PostgreSQL
docs/        → כל המסמכים
```

## הרצה
```bash
npm install
cd docker && docker compose up -d
npm run dev:web    # http://localhost:3000
npm run dev:api    # http://localhost:3001
```

## API זמין כרגע (in-memory)
- `GET  /health`
- `GET  /conversations`
- `POST /conversations`
- `GET  /conversations/:id`
- `POST /conversations/:id/close`  ← מחזיר תמלול מוכן
- `POST /messages`
- `GET  /canned-responses`

## סטטוס
- ✅ WP-01 Foundation הושלם
- 🔄 WP-02 Backend Core – Controllers בסיסיים מוכנים
