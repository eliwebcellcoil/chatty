# Chatty

מערכת צ'אט תמיכה מקצועית – פשוטה, אלגנטית, עם תורים ו-RBAC.

**Ver. 0.5.0 | Build 014 | 04.11.2026**

## תיעוד מלא
**התחל כאן:** [`docs/00-INDEX.md`](./docs/00-INDEX.md)

| מסמך | תוכן |
|------|------|
| [00-INDEX](./docs/00-INDEX.md) | אינדקס |
| [01 דרישות](./docs/01-requirements-and-concept.md) | קונספט |
| [02 איפיון](./docs/02-detailed-specification.md) | מפורט |
| [03 ארכיטקטורה](./docs/03-architecture.md) | ויזואלית |
| [04 עיצוב טכני](./docs/04-technical-design.md) | ERD + API |
| [05 Backlog](./docs/05-backlog-and-work-packages.md) | סטטוס |
| [06 באגים](./docs/06-bugfix-and-testing.md) | בדיקות |
| [07 המלצות](./docs/07-recommendations-progress.md) | 11 המלצות |
| [08 Embed](./docs/08-embed-guide.md) | וידג'ט באתר |
| [09 תורים](./docs/09-queue-and-routing.md) | ניתוב |
| [10 RBAC](./docs/10-rbac-and-admin.md) | הרשאות + Admin |
| [11 System Map](./docs/11-system-map.md) | מפת מערכת לקוד |

## הרצה
```bash
cd docker && docker compose up -d
cd apps/api && npm install && npx prisma generate && npx prisma db push && npm run start:dev
cd apps/web && npm install && npm run dev
```

| נתיב | תיאור |
|------|-------|
| `/widget` | לקוח |
| `/agent/login` | התחברות |
| `/agent` | לוח נציגים + תורים |
| `/admin` | אנליטיקה · נציגים · תוכן · הרשאות |

**admin@chatty.local / admin123** (super_admin)

## למערכות שמעדכנות קוד
קראו קודם את [`docs/11-system-map.md`](./docs/11-system-map.md) ו-[`docs/00-INDEX.md`](./docs/00-INDEX.md).  
עדכנו תיעוד ב-`docs/` בכל שינוי משמעותי + `packages/shared/src/version.ts`.
