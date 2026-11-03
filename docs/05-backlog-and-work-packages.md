# Chatty – Backlog, Discovery & Work Packages
**Ver. 0.1.1 | Build 002 | 03.11.2026**

## 1. Discovery (מה כבר ברור)
- דרישות עיקריות מוגדרות
- ארכיטקטורה נבחרה (Next.js + NestJS + PostgreSQL + Polling)
- אין צורך ב-Real-time מלא
- העברה ל-Dynamics רק בסוף
- ריבוי שפות חובה
- סנכרון מלא ל-Git

## 2. Product Backlog (עדיפויות)

### Epic 1 – Foundation (שלד)
- [ ] אתחול מונורפו (apps/web + apps/api)
- [ ] הגדרת TypeScript, ESLint, Prettier
- [ ] Docker Compose (Postgres + API)
- [ ] CI בסיסי (GitHub Actions)
- [ ] הצגת גרסה בכל מקום

### Epic 2 – Backend Core
- [ ] מודול Auth (JWT)
- [ ] מודול Conversations
- [ ] מודול Messages
- [ ] מודול Canned Responses
- [ ] מודול Surveys
- [ ] Health check

### Epic 3 – Frontend Widget (לקוח)
- [ ] כפתור צף + חלון צ'אט
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
- [ ] בדיקות בסיסיות
- [ ] תיעוד API

## 3. Work Packages (ספרינטים מוצעים)

### WP-01 – Foundation (Sprint 1)
**מטרה:** שלד עובד + Docker + גרסה  
**משך משוער:** 2–3 ימים  
**תוצרים:**
- מבנה תיקיות מלא
- Next.js + NestJS רצים
- Postgres ב-Docker
- README מעודכן
- הצגת Ver. / Build / Date

### WP-02 – Backend Core (Sprint 2)
**מטרה:** API בסיסי עובד  
**משך משוער:** 3–4 ימים  
**תוצרים:**
- Auth + Conversations + Messages
- Canned + Surveys
- Postman / OpenAPI בסיסי

### WP-03 – Widget (Sprint 3)
**מטרה:** לקוח יכול לפתוח שיחה ולשלוח הודעות  
**משך משוער:** 3 ימים

### WP-04 – Agent Dashboard (Sprint 4)
**מטרה:** נציג יכול לנהל שיחות  
**משך משוער:** 4–5 ימים

### WP-05 – Integration & Polish (Sprint 5)
**מטרה:** תמלול, סקר, RTL מלא, בדיקות  
**משך משוער:** 2–3 ימים

## 4. Definition of Done (כל משימה)
- קוד נקי + TypeScript
- אין באגים ידועים
- גרסה מעודכנת
- מסמכים מעודכנים
- נדחף ל-Git
- נבדק ידנית לפחות פעם אחת
