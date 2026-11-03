# Chatty

מערכת צ'אט תמיכה מקצועית – פשוטה, אלגנטית וממוקדת.

**Ver. 0.2.0 | Build 005 | 03.11.2026**

## הרצה מהירה
```bash
npm install
cd docker && docker compose up -d   # PostgreSQL (מוכן לשימוש עתידי)
npm run dev:api    # http://localhost:3001
npm run dev:web    # http://localhost:3000
```

## מסכים פעילים
| כתובת | תיאור |
|-------|-------|
| `/` | דף בית + ניווט |
| `/widget` | וידג'ט לקוח (שיחה + סקר) |
| `/agent` | לוח נציגים מלא |

## API עיקרי
- `POST /conversations` – פתיחת שיחה
- `GET  /conversations` – רשימה
- `GET  /conversations/:id` – שיחה + הודעות
- `POST /conversations/:id/close` – סגירה + תמלול
- `POST /messages` – שליחת הודעה
- `GET  /canned-responses`
- `POST /surveys`
- `GET  /health`

## מה עובד
- ✅ Widget לקוח (שפות, אנונימי/מזוהה, Polling, סקר)
- ✅ לוח נציגים (Inbox, Canned, הערות פנימיות, תמלול להעתקה)
- ✅ VersionBadge בכל מסך
- ✅ סגירת שיחה מייצרת תמלול מוכן ל-CRM / העתק-הדבק

## מסמכים
[`docs/`](./docs/)

## סטטוס
**Ver. 0.2.0** – ליבה פונקציונלית הושלמה (in-memory).  
השלב הבא: PostgreSQL + Auth.
