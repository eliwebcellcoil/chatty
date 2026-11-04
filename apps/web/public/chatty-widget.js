(function () {
  "use strict";
  var API = window.CHATTY_API_URL || "http://localhost:3001";
  var BASE = window.CHATTY_BASE_URL || (window.location.origin);
  var lang = window.CHATTY_LANG || "he";

  if (document.getElementById("chatty-fab")) return;

  var btn = document.createElement("button");
  btn.id = "chatty-fab";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = "💬";
  btn.style.cssText =
    "position:fixed;bottom:24px;right:24px;z-index:99999;width:56px;height:56px;border-radius:50%;" +
    "border:none;background:#1e293b;color:#fff;font-size:24px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);";

  var iframe = document.createElement("iframe");
  iframe.id = "chatty-frame";
  iframe.src = BASE + "/widget?embed=1&lang=" + encodeURIComponent(lang);
  iframe.style.cssText =
    "display:none;position:fixed;bottom:90px;right:24px;z-index:99998;width:380px;height:560px;" +
    "max-width:calc(100vw - 32px);max-height:calc(100vh - 120px);border:none;border-radius:16px;" +
    "box-shadow:0 8px 30px rgba(0,0,0,.2);background:#fff;";

  var open = false;
  btn.onclick = function () {
    open = !open;
    iframe.style.display = open ? "block" : "none";
    btn.innerHTML = open ? "✕" : "💬";
  };

  document.body.appendChild(iframe);
  document.body.appendChild(btn);
})();
