# Chatty – תפקידים, הרשאות ומודולי ניהול
**Ver. 0.5.0 | Build 014 | 04.11.2026**

## תפקידים (Roles)

| תפקיד | מזהה | תיאור |
|--------|------|--------|
| אדמין על | `super_admin` | כל ההרשאות |
| אדמין | `admin` | נציגים, תוכן, אנליטיקה, הגדרות, צ'אט |
| נציג | `agent` | טיפול בשיחות ותור |
| ניהול תוכן | `content` | Canned Responses בלבד |

## הרשאות (Permissions)

| הרשאה | תיאור |
|--------|--------|
| agents:view / agents:manage | צפייה / ניהול נציגים |
| chat:handle | מענה לשיחות |
| queue:view / queue:claim / queue:transfer | תור |
| routing:manage | מצב ניתוב |
| canned:view / canned:manage | תוכן קבוע |
| analytics:view | אנליטיקה |
| settings:manage | הגדרות |
| roles:manage | ניהול תפקידים (super_admin) |

## מודולי Admin (`/admin`)
1. **אנליטיקה** – שיחות, תור, סקרים, נציגים Online
2. **נציגים** – יצירה, תפקיד, קיבולת, canHandleChat
3. **תוכן (Canned)** – CRUD לתגובות קבועות
4. **תפקידים והרשאות** – מטריצה להצגה

## API
- `GET/POST /admin/agents`
- `PATCH /admin/agents/:id`
- `GET/POST/PATCH/DELETE /admin/canned`
- `GET /admin/analytics`
- `GET /admin/roles`

משתמש ברירת מחדל: **admin@chatty.local / admin123** (super_admin)
