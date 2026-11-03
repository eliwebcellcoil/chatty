# Chatty

מערכת צ'אט תמיכה מקצועית – פשוטה, אלגנטית וממוקדת.

**Ver. 0.1.3 | Build 004 | 03.11.2026**

## מסמכים
ראה תיקייה [`docs/`](./docs/)

## הרצה
```bash
npm install
cd docker && docker compose up -d
npm run dev:web    # http://localhost:3000
npm run dev:api    # http://localhost:3001
```

## מה עובד כרגע
- **API**: Conversations, Messages, Canned, Surveys, Close+Transcript
- **Widget**: `/widget` – פתיחת שיחה, שליחת הודעות, Polling, סקר, בחירת שפה
- VersionBadge בכל מסך

## סטטוס
- ✅ WP-01 Foundation
- 🔄 WP-02 Backend Core (in-memory מוכן, DB בהמשך)
- 🔄 WP-03 Widget (בסיסי עובד)
