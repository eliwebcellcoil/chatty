# Chatty

מערכת צ'אט תמיכה מקצועית – פשוטה, אלגנטית וממוקדת.

**Ver. 0.1.1 | Build 002 | 03.11.2026**

## מסמכים
כל המסמכים נמצאים בתיקייה [`docs/`](./docs/):

| קובץ | תיאור |
|------|-------|
| [01-requirements-and-concept.md](./docs/01-requirements-and-concept.md) | דרישות וקונספט כללי |
| [02-detailed-specification.md](./docs/02-detailed-specification.md) | איפיון מפורט |
| [03-architecture.md](./docs/03-architecture.md) | ארכיטקטורה ויזואלית |
| [04-technical-design.md](./docs/04-technical-design.md) | עיצוב טכני מלא |
| [05-backlog-and-work-packages.md](./docs/05-backlog-and-work-packages.md) | Backlog + חבילות עבודה |

## מבנה הפרויקט
```
chatty/
├── apps/
│   ├── web/          # Next.js (Widget + Dashboard)
│   └── api/          # NestJS Backend
├── packages/
│   └── shared/       # קוד משותף + גרסה
├── docker/           # docker-compose (Postgres)
└── docs/
```

## הרצה מקומית (פיתוח)
```bash
# התקנת תלויות
npm install

# הרצת מסד נתונים
cd docker && docker compose up -d

# Frontend
npm run dev:web

# Backend
npm run dev:api
```

- Frontend: http://localhost:3000
- API Health: http://localhost:3001/health

## עקרונות
- ניהול מלא לפי Agile/Scrum
- סנכרון מלא 100% בין קוד, מסמכים וגרסאות
- עיצוב פשוט ואלגנטי
- תמיכה מלאה בעברית (RTL) + אנגלית + ערבית + רוסית
- Polling (1.5–2 שניות)
- העברת שיחה ל-Dynamics 365 רק בסוף השיחה

## סטטוס נוכחי
WP-01 (Foundation) בתהליך – שלד מונורפו + גרסה + Docker מוכן.
