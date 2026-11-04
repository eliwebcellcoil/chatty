#!/usr/bin/env bash
set -e
API="${API_URL:-http://localhost:3001}"
echo "== Health =="
curl -sf "$API/health" | head -c 400
echo ""
echo "== Login =="
RESP=$(curl -sf -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@chatty.local","password":"admin123"}')
TOKEN=$(echo "$RESP" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
if [ -z "$TOKEN" ]; then echo "LOGIN FAILED: $RESP"; exit 1; fi
echo "token ok"
echo "== Create conversation =="
CONV=$(curl -sf -X POST "$API/conversations" \
  -H 'Content-Type: application/json' \
  -d '{"customerInfo":{"name":"E2E Test","isAnonymous":false},"language":"he"}')
CID=$(echo "$CONV" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
echo "conversation $CID"
echo "== Message =="
curl -sf -X POST "$API/messages" \
  -H 'Content-Type: application/json' \
  -d "{\"conversationId\":\"$CID\",\"content\":\"בדיקת E2E\",\"senderType\":\"customer\"}" > /dev/null
echo "== Shift overview =="
curl -sf "$API/admin/shift" -H "Authorization: Bearer $TOKEN" | head -c 500
echo ""
echo "== Close =="
curl -sf -X POST "$API/conversations/$CID/close" | head -c 300
echo ""
echo "E2E SMOKE OK"
