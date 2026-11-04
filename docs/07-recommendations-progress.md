# Chatty – מעקב המלצות פיתוח
**Ver. 0.3.0 | Build 009 | 04.11.2026**

## סדר ביצוע (כפי שאושר)

| # | המלצה | סטטוס |
|---|--------|--------|
| 1 | PostgreSQL (Prisma) | 🔄 בתהליך – Schema + Services + Controllers מוכנים |
| 2 | Auth JWT לנציגים | ממתין |
| 3 | הפרדת שכבות (Controller → Service → DB) | ✅ בוצע יחד עם #1 |
| 4 | CI/CD GitHub Actions | ממתין |
| 5 | Embed Script / כפתור צף | ממתין |
| 6 | Dynamics 365 (אופציונלי) | ממתין |
| 7 | Rate Limiting + Sanitization | ממתין |
| 8 | PWA | ממתין |
| 9 | לוגים + Health מתקדם | 🔄 Health בודק DB |
| 10 | בדיקות אוטומטיות | ממתין |
| 11 | סביבות dev/staging/prod | ממתין |

## מה בוצע ב-0.3.0
- Prisma schema מלא (Agent, Conversation, Message, CannedResponse, Survey)
- PrismaService + PrismaModule
- ConversationsService / MessagesService / CannedService / SurveysService
- Controllers דקים שמשתמשים ב-Services בלבד
- הסרת in-memory store
- Seed אוטומטי ל-Canned Responses
- Health endpoint בודק חיבור ל-DB
