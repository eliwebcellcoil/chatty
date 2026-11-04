# Chatty

מערכת צ'אט תמיכה מקצועית.

**Ver. 0.3.1 | Build 010 | 04.11.2026**

## הרצה
```bash
# 1. מסד נתונים
cd docker && docker compose up -d

# 2. API
cd apps/api
cp .env.example .env   # או השתמש ב-.env הקיים
npm install
npx prisma generate
npx prisma db push
npm run start:dev      # :3001

# 3. Web
cd apps/web
npm install
npm run dev            # :3000
```

## מסכים
- `/widget` – לקוח
- `/agent` – נציגים

## סטטוס
- ✅ MVP + שכבות Service
- 🔄 PostgreSQL (Prisma) – קוד מוכן, יש להריץ `prisma db push`
- ✅ Auth JWT בסיסי

מסמכים: [`docs/`](./docs/)
