# Chatty

מערכת צ'אט תמיכה מקצועית.

**Ver. 0.2.2 | Build 007 | 03.11.2026**

## הרצה
```bash
npm install
cd docker && docker compose up -d
npm run dev:api   # http://localhost:3001
npm run dev:web   # http://localhost:3000
```

## מסכים
| נתיב | תיאור |
|------|-------|
| `/` | בית + ניווט |
| `/widget` | וידג'ט לקוח |
| `/agent` | לוח נציגים |

## יכולות
- שיחה מזוהה / אנונימית
- 4 שפות (he/en/ar/ru) + RTL
- Polling
- Canned Responses
- הערות פנימיות
- סגירה + **תמלול מוכן להעתקה** ל-Dynamics
- סקר
- חיפוש בלוח נציגים
- Version בכל מסך

## סטטוס
**MVP פונקציונלי הושלם.**  
מוכן לשימוש ולהדגמה.  
המשך: PostgreSQL + Auth.

מסמכים ב-[`docs/`](./docs/).
