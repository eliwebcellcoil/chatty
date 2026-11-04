# Chatty – אינדקס תיעוד מלא
**Ver. 0.5.0 | Build 014 | 04.11.2026**  
**ריפו:** https://github.com/eliwebcellcoil/chatty

מסמך זה הוא נקודת הכניסה לכל מי שעובד על הקוד (כולל מערכות אוטומטיות).

## רשימת מסמכים

| קובץ | תוכן |
|------|------|
| [00-INDEX.md](./00-INDEX.md) | אינדקס זה |
| [01-requirements-and-concept.md](./01-requirements-and-concept.md) | דרישות וקונספט |
| [02-detailed-specification.md](./02-detailed-specification.md) | איפיון מפורט |
| [03-architecture.md](./03-architecture.md) | ארכיטקטורה ויזואלית |
| [04-technical-design.md](./04-technical-design.md) | עיצוב טכני + ERD + API |
| [05-backlog-and-work-packages.md](./05-backlog-and-work-packages.md) | Backlog וסטטוס |
| [06-bugfix-and-testing.md](./06-bugfix-and-testing.md) | באגים ובדיקות |
| [07-recommendations-progress.md](./07-recommendations-progress.md) | מעקב 11 המלצות |
| [08-embed-guide.md](./08-embed-guide.md) | הטמעת וידג'ט באתר |
| [09-queue-and-routing.md](./09-queue-and-routing.md) | תורים וניתוב |
| [10-rbac-and-admin.md](./10-rbac-and-admin.md) | תפקידים, הרשאות, Admin |
| [11-system-map.md](./11-system-map.md) | מפת מערכת מלאה (למפתחים/סוכנים) |

## סטטוס מוצר נוכחי
- MVP פונקציונלי ✅
- PostgreSQL (Prisma) ✅
- Auth JWT ✅
- תורים (pull + auto) + Transfer ✅
- RBAC + Admin (אנליטיקה, נציגים, Canned) ✅
- Embed script ✅
- Rate limit + PWA בסיסי ✅

## הרצה
```bash
cd docker && docker compose up -d
cd apps/api && npm install && npx prisma generate && npx prisma db push && npm run start:dev
cd apps/web && npm install && npm run dev
```
- Web: http://localhost:3000
- API: http://localhost:3001
- Login: admin@chatty.local / admin123 (super_admin)

## מבנה קוד
```
apps/web/     Next.js – /widget /agent /agent/login /admin
apps/api/     NestJS + Prisma
packages/shared/  version, types, rbac
docs/         כל התיעוד
docker/       PostgreSQL
```
