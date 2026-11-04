# Chatty – מפת מערכת מלאה (System Map)
**Ver. 0.5.0 | Build 014 | 04.11.2026**

מסמך זה מיועד למפתחים ולמערכות אוטומטיות שמעדכנות קוד.

## 1. מסכים (Frontend – Next.js)
| נתיב | קובץ | תיאור |
|------|------|--------|
| `/` | `apps/web/app/page.tsx` | דף בית + ניווט |
| `/widget` | `apps/web/app/widget/page.tsx` | וידג'ט לקוח (שפות, אנונימי, Polling, סקר) |
| `/agent/login` | `apps/web/app/agent/login/page.tsx` | התחברות JWT |
| `/agent` | `apps/web/app/agent/page.tsx` | לוח נציגים + תור + העברה |
| `/admin` | `apps/web/app/admin/page.tsx` | אנליטיקה, נציגים, Canned, Roles |

## 2. API (NestJS)
| Method | Endpoint | תיאור |
|--------|----------|--------|
| GET | `/health` | Health + DB check |
| POST | `/auth/login` | JWT |
| GET | `/auth/me` | משתמש נוכחי |
| GET/POST | `/conversations` | רשימה / פתיחה |
| GET | `/conversations/:id` | שיחה + הודעות |
| POST | `/conversations/:id/close` | סגירה + תמלול |
| POST | `/messages` | שליחת הודעה |
| GET | `/canned-responses` | תגובות קבועות |
| POST | `/surveys` | סקר |
| GET | `/queue` | תור לא משויך |
| GET | `/queue/agents` | נציגים + עומס |
| POST | `/queue/claim-next` | משיכת שיחה |
| POST | `/queue/claim/:id` | שיוך ספציפי |
| POST | `/queue/transfer` | העברה |
| POST | `/queue/agent-status` | Online/Away/Offline |
| GET/POST | `/queue/routing-mode` | pull \| auto |
| GET/POST | `/admin/agents` | ניהול נציגים |
| PATCH | `/admin/agents/:id` | עדכון נציג |
| GET/POST/PATCH/DELETE | `/admin/canned` | ניהול תוכן |
| GET | `/admin/analytics` | אנליטיקה |
| GET | `/admin/roles` | מטריצת הרשאות |

## 3. מודל נתונים (Prisma)
- **Agent** – name, email, passwordHash, role, status, maxConcurrentChats, canHandleChat
- **Conversation** – status, customer*, isAnonymous, language, tags, assignedAgentId
- **Message** – conversationId, senderType, content, isInternal
- **CannedResponse** – title, content, language, category
- **Survey** – conversationId, rating, comment
- **AppSetting** – key/value (routing_mode)

## 4. תפקידים
- `super_admin` – הכול
- `admin` – נציגים, תוכן, אנליטיקה, צ'אט
- `agent` – צ'אט + תור
- `content` – Canned בלבד

## 5. ניתוב
- **pull** – תור כללי, נציג מושך לפי קיבולת
- **auto** – שיוך לנציג Online עם הכי פחות עומס

## 6. עקרונות קוד
- TypeScript בכל מקום
- Controller → Service → Prisma
- Polling 1.5–2s (לא WebSockets)
- Version בכל מסך: `packages/shared/src/version.ts`
- תיעוד ב-`docs/` מתעדכן בכל שינוי משמעותי
