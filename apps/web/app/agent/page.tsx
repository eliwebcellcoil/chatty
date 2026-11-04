"use client";

import { useState, useEffect, useCallback } from "react";
import { VersionBadge } from "@/components/VersionBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Conversation = {
  id: string;
  status: string;
  customerInfo?: { name?: string; isAnonymous: boolean };
  customerName?: string;
  isAnonymous?: boolean;
  language: string;
  createdAt: string;
  closedAt?: string;
};

type Message = {
  id: string;
  senderType: string;
  content: string;
  isInternal?: boolean;
  createdAt: string;
};

export default function AgentDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [canned, setCanned] = useState<{ id: string; title: string; content: string }[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("open");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`${API_URL}/conversations?${params}`);
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch {}
  }, [filter, search]);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/conversations/${id}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
    const t = setInterval(loadConversations, 2000);
    return () => clearInterval(t);
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedId) return;
    loadConversation(selectedId);
    const t = setInterval(() => loadConversation(selectedId), 1800);
    return () => clearInterval(t);
  }, [selectedId, loadConversation]);

  useEffect(() => {
    fetch(`${API_URL}/canned-responses?language=he`)
      .then((r) => r.json())
      .then((d) => setCanned(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  async function sendReply(content: string, isInternal = false) {
    if (!selectedId || !content.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedId,
          content: content.trim(),
          senderType: "agent",
          isInternal,
        }),
      });
      setInput("");
      await loadConversation(selectedId);
    } finally {
      setLoading(false);
    }
  }

  async function closeChat() {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/conversations/${selectedId}/close`, { method: "POST" });
      const data = await res.json();
      if (data.transcriptFormatted) setTranscript(data.transcriptFormatted);
      await loadConversations();
      await loadConversation(selectedId);
    } finally {
      setLoading(false);
    }
  }

  const filtered = conversations.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
      {/* Top bar */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">Chatty</span>
          <span className="text-slate-400 text-sm">לוח נציגים</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש..."
            className="bg-slate-800 text-white placeholder-slate-400 rounded-full px-3 py-1 w-32 outline-none focus:ring-1 focus:ring-slate-500"
          />
          {(["open", "closed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full ${filter === f ? "bg-white text-slate-900" : "bg-slate-700"}`}
            >
              {f === "open" ? "פתוחות" : f === "closed" ? "סגורות" : "הכל"}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – conversations list */}
        <aside className="w-80 border-l border-slate-200 bg-white overflow-y-auto shrink-0">
          {conversations.length === 0 && (
            <p className="p-4 text-sm text-slate-400 text-center">אין שיחות</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedId(c.id);
                setTranscript(null);
              }}
              className={`w-full text-right px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition ${
                selectedId === c.id ? "bg-slate-100" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate">
                  {(c.isAnonymous ?? c.customerInfo?.isAnonymous)
                    ? "אנונימי"
                    : (c.customerName || c.customerInfo?.name || "לקוח")}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    c.status === "open"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {c.status === "open" ? "פתוח" : "סגור"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(c.createdAt).toLocaleString("he-IL")} · {c.language}
              </p>
            </button>
          ))}
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col">
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              בחר שיחה מהרשימה
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {(selected?.isAnonymous ?? selected?.customerInfo?.isAnonymous)
                      ? "אנונימי"
                      : (selected?.customerName || selected?.customerInfo?.name || "לקוח")}
                  </p>
                  <p className="text-xs text-slate-400">{selectedId.slice(0, 8)}…</p>
                </div>
                {selected?.status === "open" && (
                  <button
                    onClick={closeChat}
                    disabled={loading}
                    className="text-sm bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  >
                    סגור שיחה + תמלול
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.senderType === "agent" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                        m.isInternal
                          ? "bg-amber-50 border border-amber-200 text-amber-900"
                          : m.senderType === "agent"
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {m.isInternal && (
                        <span className="text-[10px] block mb-1 opacity-70">הערה פנימית</span>
                      )}
                      {m.content}
                      <span className="block text-[10px] mt-1 opacity-60">
                        {new Date(m.createdAt).toLocaleTimeString("he-IL")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transcript box */}
              {transcript && (
                <div className="mx-4 mb-2 p-3 bg-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">תמלול מוכן להעתקה</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(transcript)}
                      className="text-blue-600 hover:underline"
                    >
                      העתק
                    </button>
                  </div>
                  {transcript}
                </div>
              )}

              {/* Canned + Input */}
              {selected?.status === "open" && (
                <div className="border-t border-slate-200 bg-white p-3 space-y-2">
                  {canned.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {canned.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => sendReply(c.content)}
                          className="shrink-0 text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full"
                        >
                          {c.title}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply(input)}
                      placeholder="הקלד תשובה..."
                      className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
                    />
                    <button
                      onClick={() => sendReply(input)}
                      disabled={loading || !input.trim()}
                      className="bg-slate-800 text-white rounded-full px-5 py-2 text-sm disabled:opacity-40"
                    >
                      שלח
                    </button>
                    <button
                      onClick={() => sendReply(input, true)}
                      disabled={loading || !input.trim()}
                      className="text-xs text-amber-700 border border-amber-300 rounded-full px-3 py-2 disabled:opacity-40"
                      title="הערה פנימית"
                    >
                      פנימי
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <VersionBadge />
    </div>
  );
}
