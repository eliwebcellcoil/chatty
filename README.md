# Chatty

מערכת צ'אט תמיכה מקצועית.

**Ver. 0.2.1 | Build 006 | 03.11.2026**

## הרצה
```bash
npm install
cd docker && docker compose up -d
npm run dev:api   # :3001
npm run dev:web   # :3000
```

## מסכים
- `/` – בית
- `/widget` – וידג'ט לקוח
- `/agent` – לוח נציגים

## יכולות עובדות
- פתיחת שיחה (מזוהה / אנונימי)
- ריבוי שפות (he / en / ar / ru)
- Polling 1.5–2 שניות
- תגובות קבועות (Canned)
- הערות פנימיות
- סגירת שיחה + **תמלול מוכן להעתקה** ל-Dynamics/CRM
- סקר לאחר סגירה
- VersionBadge בכל מסך

## API
`GET/POST /conversations` · `GET /conversations/:id` · `POST /conversations/:id/close`  
`POST /messages` · `GET /canned-responses` · `POST /surveys` · `GET /health`

## מסמכים
[`docs/`](./docs/)

## סטטוס
ליבה פונקציונלית **הושלמה** (in-memory).  
מוכן ל-demo מלא. השלב הבא: PostgreSQL + Auth.
