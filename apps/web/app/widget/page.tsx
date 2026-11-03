"use client";

import { useState, useEffect, useRef } from "react";
import { VersionBadge } from "@/components/VersionBadge";
import {
  createConversation,
  sendMessage,
  getConversation,
  closeConversation,
  submitSurvey,
} from "@/lib/api";

type Msg = {
  id: string;
  senderType: string;
  content: string;
  createdAt: string;
};

export default function WidgetPage() {
  const [step, setStep] = useState<"start" | "chat" | "survey" | "done">("start");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("he");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Polling
  useEffect(() => {
    if (!conversationId || step !== "chat") return;
    const interval = setInterval(async () => {
      try {
        const data = await getConversation(conversationId);
        if (data.messages) setMessages(data.messages);
        if (data.status === "closed") setStep("survey");
      } catch {}
    }, 1800);
    return () => clearInterval(interval);
  }, [conversationId, step]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startChat(anonymous: boolean) {
    setLoading(true);
    try {
      const conv = await createConversation({
        customerInfo: anonymous
          ? { isAnonymous: true }
          : { name: name || "לקוח", isAnonymous: false },
        language,
      });
      setConversationId(conv.id);
      setStep("chat");
      // Welcome message simulation could be added later
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || !conversationId) return;
    const content = input.trim();
    setInput("");
    setLoading(true);
    try {
      await sendMessage({
        conversationId,
        content,
        senderType: "customer",
      });
      const data = await getConversation(conversationId);
      if (data.messages) setMessages(data.messages);
    } finally {
      setLoading(false);
    }
  }

  async function handleClose() {
    if (!conversationId) return;
    setLoading(true);
    try {
      await closeConversation(conversationId);
      setStep("survey");
    } finally {
      setLoading(false);
    }
  }

  async function handleSurvey() {
    if (!conversationId) return;
    setLoading(true);
    try {
      await submitSurvey({ conversationId, rating, comment });
      setStep("done");
    } finally {
      setLoading(false);
    }
  }

  const dir = language === "he" || language === "ar" ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">Chatty</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-slate-700 rounded px-2 py-1"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {step === "start" && (
            <div className="space-y-4 pt-8">
              <p className="text-center text-slate-600">
                {language === "he" && "ברוכים הבאים לתמיכה"}
                {language === "en" && "Welcome to support"}
                {language === "ar" && "مرحبًا بكم في الدعم"}
                {language === "ru" && "Добро пожаловать в поддержку"}
              </p>
              <input
                type="text"
                placeholder={language === "he" ? "שם (אופציונלי)" : "Name (optional)"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={() => startChat(false)}
                disabled={loading}
                className="w-full bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
              >
                {language === "he" ? "התחל שיחה" : "Start chat"}
              </button>
              <button
                onClick={() => startChat(true)}
                disabled={loading}
                className="w-full border border-slate-300 rounded-lg py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {language === "he" ? "המשך כאנונימי" : "Continue anonymously"}
              </button>
            </div>
          )}

          {step === "chat" && (
            <>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderType === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.senderType === "customer"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}

          {step === "survey" && (
            <div className="space-y-4 pt-6">
              <p className="text-center font-medium">
                {language === "he" ? "איך הייתה השיחה?" : "How was the chat?"}
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={`w-10 h-10 rounded-full text-sm font-medium ${
                      rating === n ? "bg-slate-800 text-white" : "bg-slate-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={language === "he" ? "הערה (אופציונלי)" : "Comment (optional)"}
                className="w-full border rounded-lg px-3 py-2 text-sm h-20"
              />
              <button
                onClick={handleSurvey}
                disabled={loading}
                className="w-full bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium"
              >
                {language === "he" ? "שלח" : "Submit"}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center pt-16 space-y-2">
              <p className="text-lg font-medium">
                {language === "he" ? "תודה!" : "Thank you!"}
              </p>
              <p className="text-slate-500 text-sm">
                {language === "he" ? "השיחה הסתיימה" : "The conversation has ended"}
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        {step === "chat" && (
          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={language === "he" ? "הקלד הודעה..." : "Type a message..."}
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-slate-800 text-white rounded-full px-4 py-2 text-sm disabled:opacity-40"
            >
              {language === "he" ? "שלח" : "Send"}
            </button>
            <button
              onClick={handleClose}
              className="text-xs text-slate-500 px-2 hover:text-slate-800"
              title="Close"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      <VersionBadge />
    </div>
  );
}
