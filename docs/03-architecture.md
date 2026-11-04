# Chatty – ארכיטקטורה פונקציונלית ותשתית (ויזואלית)
**Ver. 0.5.0 | Build 014 | 04.11.2026**

## 1. תרשים ארכיטקטורה כללית (High-Level)

```mermaid
flowchart TB
    subgraph Clients
        W[Widget לקוח<br/>אתר / אפליקציה]
        A[לוח נציגים<br/>Desktop + Mobile PWA]
    end

    subgraph Frontend["Frontend – Next.js 15"]
        UI[UI Components<br/>shadcn/ui + Tailwind]
        I18N[next-intl<br/>he / en / ar / ru]
        POLL[Polling 1.5-2s]
    end

    subgraph Backend["Backend – NestJS / Hono"]
        API[REST API]
        AUTH[JWT Auth]
        VAL[Validation + Sanitize]
    end

    subgraph Data
        DB[(PostgreSQL)]
        FILES[Azure Blob / Local]
    end

    subgraph External
        DYN[Dynamics 365<br/>רק בסוף השיחה]
        CF[Cloudflare Pages]
        AZ[Azure App Service<br/>או Windows Server]
    end

    W --> UI
    A --> UI
    UI --> POLL
    POLL --> API
    API --> AUTH
    API --> VAL
    API --> DB
    API --> FILES
    API -.->|תמלול / Case| DYN
    Frontend --> CF
    Backend --> AZ
```

## 2. זרימת נתונים בשיחה (Sequence)

```mermaid
sequenceDiagram
    participant C as לקוח (Widget)
    participant F as Frontend
    participant B as Backend
    participant D as PostgreSQL
    participant AG as נציג

    C->>F: פתיחת צ'אט + הודעה
    F->>B: POST /messages (Polling)
    B->>D: שמירת הודעה
    B-->>F: 200 OK
    F-->>C: הצגת הודעה

    loop כל 1.5-2 שניות
        AG->>F: Polling /conversations
        F->>B: GET /conversations
        B->>D: שליפת שיחות
        B-->>F: רשימת שיחות
        F-->>AG: עדכון Inbox
    end

    AG->>F: שליחת תשובה / Canned
    F->>B: POST /messages
    B->>D: שמירה
    B-->>F: OK

    AG->>F: סגירת שיחה
    F->>B: POST /conversations/:id/close
    B->>D: עדכון סטטוס + יצירת תמלול
    B-->>F: תמלול מוכן
    F-->>C: הצגת סקר
```

## 3. מבנה תיקיות מוצע

```
chatty/
├── apps/
│   ├── web/                    # Next.js (Widget + Agent Dashboard)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── messages/           # i18n (he, en, ar, ru)
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── conversations/
│       │   │   ├── messages/
│       │   │   ├── canned/
│       │   │   └── agents/
│       │   └── main.ts
├── packages/
│   └── shared/                 # טיפוסים משותפים, constants
├── docs/                       # כל המסמכים
├── docker/
├── .github/workflows/
└── README.md
```

## 4. רכיבי תשתית

| רכיב              | טכנולוגיה                          | הערות                              |
|-------------------|------------------------------------|------------------------------------|
| Frontend          | Next.js 15 + Tailwind + shadcn/ui | Cloudflare Pages (עיקרי)           |
| Backend           | NestJS (מומלץ)                     | Azure App Service / Windows Server |
| Database          | PostgreSQL                         | Azure Database for PostgreSQL      |
| Auth              | JWT                                | פשוט ומאובטח                       |
| Real-time         | Polling 1.5–2 שניות                | ללא WebSockets                     |
| i18n              | next-intl                          | RTL + LTR מלא                      |
| CI/CD             | GitHub Actions                     |                                   |
| קבצים (אופציונלי) | Azure Blob Storage                 |                                   |

## 5. עקרונות טכניים
- קוד נקי, מודולרי, מתועד
- TypeScript בכל מקום
- בדיקות יחידה + אינטגרציה בסיסיות
- Docker לתמיכה קלה
- לוגים מסודרים
- הצגת Ver. / Build / תאריך בכל מסך
- סנכרון מלא 100% ל-Git בכל שינוי

## 6. סביבות
- **Development** – מקומי + Docker
- **Staging** – Cloudflare + Azure
- **Production** – אותו דבר עם הגדרות ייצור
