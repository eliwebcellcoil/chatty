# Chatty

מערכת צ'אט תמיכה מקצועית עם ניהול תורים.

**Ver. 0.4.0 | Build 013 | 04.11.2026**

## הרצה
```bash
cd docker && docker compose up -d
cd apps/api && npm install && npx prisma generate && npx prisma db push && npm run start:dev
cd apps/web && npm install && npm run dev
```

- Widget: http://localhost:3000/widget  
- Agent: http://localhost:3000/agent/login  
- **admin@chatty.local / admin123**

## ניהול תורים
- **תור כללי (pull)** – נציג מושך שיחות לפי קיבולת
- **שיוך אוטומטי (auto)** – לפי עומס נציגים Online
- העברה בין נציגים + סטטוס + קיבולת

פירוט: [docs/09-queue-and-routing.md](./docs/09-queue-and-routing.md)
