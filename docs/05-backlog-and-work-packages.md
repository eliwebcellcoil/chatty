# Chatty – Backlog, Discovery & Work Packages
**Ver. 0.1.3 | Build 004 | 03.11.2026**

## 1. Discovery (מה כבר ברור)
- דרישות עיקריות מוגדרות
- ארכיטקטורה נבחרה (Next.js + NestJS + PostgreSQL + Polling)
- אין צורך ב-Real-time מלא
- העברה ל-Dynamics רק בסוף
- ריבוי שפות חובה
- סנכרון מלא ל-Git

## 2. Product Backlog (עדיפויות)

### Epic 1 – Foundation (שלד) ✅
- [x] אתחול מונורפו (apps/web + apps/api)
- [x] הגדרת TypeScript
- [x] Docker Compose (Postgres)
- [x] הצגת גרסה בכל מקום
- [x] Shared types + version

### Epic 2 – Backend Core (בתהליך)
- [ ] מודול Auth (JWT) – בהמשך
- [x] מודול Conversations (בסיסי – in-memory)
- [x] מודול Messages (בסיסי – in-memory)
- [x] מודול Canned Responses (בסיסי)
- [x] מודול Surveys
- [x] Health check

### Epic 3 – Frontend Widget (לקוח)
- [x] כפתור צף + חלון צ'אט (בסיסי)
- [ ] בחירת שפה
- [ ] הזדהות / אנונימי
- [ ] שליחת הודעות + Polling
- [ ] סקר בסוף

### Epic 4 – Agent Dashboard
- [ ] Inbox
- [ ] חלון שיחה
- [ ] Canned Responses
- [ ] הערות פנימיות
- [ ] סגירת שיחה + תמלול
- [ ] חיפוש
- [ ] Responsive + PWA בסיסי

### Epic 5 – Polish & Export
- [ ] ייצוא תמלול (העתק + טקסט מעוצב)
- [ ] תמיכה מלאה ב-RTL/LTR
- [ ] חיבור PostgreSQL אמיתי
- [ ] בדיקות בסיסיות
- [ ] תיעוד API

## 3. Work Packages

### WP-01 – Foundation ✅ הושלם
- מונורפו, Next.js, NestJS, Shared, Docker, VersionBadge

### WP-02 – Backend Core (בתהליך)
**סטטוס:** Controllers בסיסיים ל-Conversations / Messages / Canned מוכנים (in-memory).  
הבא: Surveys + Auth + מעבר ל-PostgreSQL.

### WP-03 – Widget
### WP-04 – Agent Dashboard
### WP-05 – Integration & Polish

## 4. Definition of Done
- קוד נקי + TypeScript
- אין באגים ידועים
- גרסה מעודכנת
- מסמכים מעודכנים
- נדחף ל-Git
