# Chatty – בדיקת E2E
**Ver. 0.5.1 | Build 015 | 04.11.2026**

## הרצה מקומית
```bash
cd docker && docker compose up -d
cd apps/api && npm install && npx prisma generate && npx prisma db push && npm run start:dev
cd apps/web && npm install && npm run dev
```

## תרחיש E2E מלא

### A. לקוח
1. פתח http://localhost:3000/widget
2. בחר שפה → הזן שם או אנונימי → התחל שיחה
3. שלח הודעה "שלום, יש בעיה"

### B. תור + נציג
4. פתח http://localhost:3000/agent/login  
   `admin@chatty.local` / `admin123`
5. ודא סטטוס **Online**
6. עבור לפילטר **תור** – השיחה אמורה להופיע  
   או לחץ **קח שיחה הבאה**
7. השב (ידני או Canned)
8. הוסף הערה פנימית
9. (אופציונלי) העבר לנציג אחר אם קיים

### C. סגירה + CRM + סקר
10. לחץ **סגור + תמלול**
11. העתק תמלול (מוכן ל-CRM)
12. ב-/widget אמור להופיע סקר – דרג ושלח

### D. מנהל משמרת
13. http://localhost:3000/shift
14. בדוק: בתור, פתוחות, Online, ניצולת, תור ממתין

### E. Admin
15. http://localhost:3000/admin  
    אנליטיקה · נציגים · תוכן · תפקידים

## API smoke (curl)
```bash
curl -s http://localhost:3001/health | jq
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@chatty.local","password":"admin123"}' | jq -r .token)
curl -s http://localhost:3001/admin/shift -H "Authorization: Bearer $TOKEN" | jq .summary
```
