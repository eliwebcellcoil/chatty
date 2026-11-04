# Chatty

מערכת צ'אט תמיכה מקצועית.

**Ver. 0.3.2 | Build 011 | 04.11.2026**

## הרצה
```bash
cd docker && docker compose up -d
cd apps/api && npm install && npx prisma generate && npx prisma db push && npm run start:dev
cd apps/web && npm install && npm run dev
```

| נתיב | תיאור |
|------|-------|
| `/widget` | וידג'ט לקוח |
| `/agent/login` | התחברות נציג |
| `/agent` | לוח נציגים |

**Admin ברירת מחדל:** `admin@chatty.local` / `admin123`

## Embed באתר
ראה [docs/08-embed-guide.md](./docs/08-embed-guide.md)

## התקדמות המלצות
[docs/07-recommendations-progress.md](./docs/07-recommendations-progress.md)

## סטטוס
✅ PostgreSQL · Auth · Services · CI · Embed  
הבא: Rate limiting, PWA, בדיקות
