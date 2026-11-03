# Chatty – ארכיטקטורה פונקציונלית ותשתית
**Ver. 0.1.0 | Build 001 | 03.11.2026**

## 1. ארכיטקטורה פונקציונלית

### Frontend
- Next.js 15 (App Router)
- Tailwind CSS + shadcn/ui
- next-intl לריבוי שפות (RTL/LTR)
- PWA לנציגים
- Polling כל 1.5–2 שניות

### Backend
- NestJS (מומלץ) או Hono (לקלילות מקסימלית)
- REST API
- JWT Authentication
- Validation + Sanitization

### Database
- PostgreSQL

### קבצים (אופציונלי)
- Azure Blob Storage או אחסון מקומי

## 2. ארכיטקטורת תשתית

| רכיב          | פתרון מומלץ                          | חלופות                     |
|---------------|--------------------------------------|----------------------------|
| Frontend      | Cloudflare Pages                     | Azure Static Web Apps      |
| Backend       | Azure App Service / Windows Server   | Cloudflare Workers         |
| Database      | Azure Database for PostgreSQL        | PostgreSQL מקומי / SQL Server |
| CI/CD         | GitHub Actions                       | -                          |
| קבצים         | Azure Blob Storage                   | Local / S3 compatible      |

## 3. עקרונות טכניים
- קוד נקי, מודולרי ומתועד
- בדיקות יחידה + בדיקות אינטגרציה בסיסיות
- Docker לתמיכה קלה בהרצה
- לוגים מסודרים
- אבטחה בסיסית (HTTPS, rate limit, sanitization)
- תמיכה מלאה ב-RTL ו-LTR

## 4. ניהול גרסאות ו-Agile
- Semantic Versioning
- כל שינוי → עדכון Build + תאריך
- Changelog מעודכן תמיד ב-Git
- Issues + Projects ב-GitHub לניהול משימות
- סנכרון מלא 100% בין קוד, מסמכים וגרסאות

## 5. מבנה תיקיות מוצע (ראשוני)
```
chatty/
├── apps/
│   ├── web/                 # Next.js (Widget + Dashboard)
│   └── api/                 # NestJS / Hono Backend
├── packages/
│   └── shared/              # טיפוסים משותפים, i18n וכו'
├── docs/                    # כל המסמכים
├── docker/
├── .github/
└── README.md
```

## 6. סביבות
- Development
- Staging
- Production
