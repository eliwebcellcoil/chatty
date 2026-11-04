# Chatty – מעקב המלצות פיתוח
**Ver. 0.3.2 | Build 011 | 04.11.2026**

| # | המלצה | סטטוס |
|---|--------|--------|
| 1 | PostgreSQL (Prisma) | ✅ |
| 2 | Auth JWT | ✅ |
| 3 | הפרדת שכבות | ✅ |
| 4 | CI/CD GitHub Actions | ✅ `.github/workflows/ci.yml` |
| 5 | Embed Script / כפתור צף | ✅ `public/chatty-widget.js` + מדריך |
| 6 | Dynamics 365 | ממתין (תמלול כבר מוכן) |
| 7 | Rate Limiting | הבא |
| 8 | PWA | ממתין |
| 9 | לוגים + Health | 🔄 חלקי |
| 10 | בדיקות אוטומטיות | ממתין |
| 11 | סביבות | ממתין |

## הוראות הרצה (PostgreSQL)
```bash
cd docker && docker compose up -d
cd apps/api && npm install && npx prisma generate && npx prisma db push && npm run start:dev
cd apps/web && npm install && npm run dev
```
Admin: admin@chatty.local / admin123
