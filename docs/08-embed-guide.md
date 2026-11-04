# Chatty – מדריך הטמעת וידג'ט באתר
**Ver. 0.5.0 | Build 014 | 04.11.2026**

## הטמעה בסיסית

הוסף לפני `</body>`:

```html
<script>
  window.CHATTY_API_URL = "https://YOUR-API-DOMAIN";
  window.CHATTY_BASE_URL = "https://YOUR-WEB-DOMAIN";
  window.CHATTY_LANG = "he"; // he | en | ar | ru
</script>
<script src="https://YOUR-WEB-DOMAIN/chatty-widget.js" async></script>
```

יופיע כפתור צף בפינה. לחיצה פותחת את חלון הצ'אט.
