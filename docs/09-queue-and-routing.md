# Chatty – ניהול תורים וניתוב נציגים
**Ver. 0.5.0 | Build 014 | 04.11.2026**

## מצבי ניתוב

### 1. תור כללי (pull) – ברירת מחדל
- שיחה חדשה נכנסת לתור ללא שיוך
- נציג לוחץ **קח שיחה הבאה** או **קח שיחה זו**
- נבדקת קיבולת (`maxConcurrentChats`)

### 2. שיוך אוטומטי (auto)
- שיחה חדשה משויכת אוטומטית לנציג Online עם הכי פחות עומס ועם מקום פנוי
- אם אין נציג פנוי – נשארת בתור

## יכולות נציג
| פעולה | תיאור |
|--------|--------|
| סטטוס | Online / Away / Offline |
| קח שיחה הבאה | מושך מהתור הכללי |
| קח שיחה זו | שיוך ידני מתוך התור |
| העבר | Transfer לנציג אחר (עם בדיקת קיבולת) |
| קיבולת | `maxConcurrentChats` (ברירת מחדל 3) |
| canHandleChat | האם מורשה לענות לצ'אט |

## API
- `GET /queue` – תור לא משויך
- `GET /queue/agents` – נציגים + עומס
- `POST /queue/claim-next`
- `POST /queue/claim/:id`
- `POST /queue/transfer` `{ conversationId, toAgentId }`
- `POST /queue/agent-status` `{ status }`
- `GET|POST /queue/routing-mode`

## אחרי עדכון Schema
```bash
cd apps/api && npx prisma db push
```
