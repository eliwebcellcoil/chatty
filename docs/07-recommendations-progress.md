# Chatty – מעקב המלצות פיתוח
**Ver. 0.3.1 | Build 010 | 04.11.2026**

| # | המלצה | סטטוס |
|---|--------|--------|
| 1 | PostgreSQL (Prisma) | ✅ Schema + Services + Controllers |
| 2 | Auth JWT לנציגים | ✅ Login API + Guard + דף התחברות + Default Admin |
| 3 | הפרדת שכבות | ✅ Controller → Service → Prisma |
| 4 | CI/CD | ממתין |
| 5 | Embed Script | ממתין |
| 6 | Dynamics 365 | ממתין |
| 7 | Rate Limiting | ממתין |
| 8 | PWA | ממתין |
| 9 | לוגים + Health | 🔄 Health בודק DB |
| 10 | בדיקות אוטומטיות | ממתין |
| 11 | סביבות | ממתין |

## פרטי Auth
- `POST /auth/login` – מחזיר JWT
- `GET /auth/me` – פרטי משתמש מהטוקן
- AuthGuard מוכן לשימוש
- משתמש ברירת מחדל: `admin@chatty.local` / `admin123`
- דף: `/agent/login`
