"use client";

import { useState, useEffect, useCallback } from "react";
import { VersionBadge } from "@/components/VersionBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Conversation = {
  id: string;
  status: string;
  customerName?: string;
  isAnonymous?: boolean;
  language: string;
  createdAt: string;
  closedAt?: string;
  assignedAgentId?: string | null;
};

type Message = {
  id: string;
  senderType: string;
  content: string;
  isInternal?: boolean;
  createdAt: string;
};

type AgentInfo = {
  id: string;
  name: string;
  status: string;
  currentLoad?: number;
  maxConcurrentChats?: number;
  canHandleChat?: boolean;
};

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("chatty_token") : null;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export default function AgentDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [queue, setQueue] = useState<Conversation[]>([]);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [canned, setCanned] = useState<{ id: string; title: string; content: string }[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed" | "mine" | "queue">("mine");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [routingMode, setRoutingMode] = useState<"pull" | "auto">("pull");
  const [myStatus, setMyStatus] = useState<"online" | "away" | "offline">("online");
  const [transferTo, setTransferTo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("chatty_token");
    if (!token) window.location.href = "/agent/login";
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter === "open" || filter === "closed") params.set("status", filter);
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`${API_URL}/conversations?${params}`);
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch {}
  }, [filter, search]);

  const loadQueue = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/queue`);
      const data = await res.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  const loadAgents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/queue/agents`);
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/conversations/${id}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
    loadQueue();
    loadAgents();
    fetch(`${API_URL}/queue/routing-mode`)
      .then((r) => r.json())
      .then((d) => d.routingMode && setRoutingMode(d.routingMode))
      .catch(() => {});
    const t = setInterval(() => {
      loadConversations();
      loadQueue();
      loadAgents();
    }, 2000);
    return () => clearInterval(t);
  }, [loadConversations, loadQueue, loadAgents]);

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
        headers: authHeaders(),
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

  async function claimNext() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/queue/claim-next`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else if (data.conversation) {
        setSelectedId(data.conversation.id);
        await loadConversations();
        await loadQueue();
      }
    } finally {
      setLoading(false);
    }
  }

  async function claimSpecific(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/queue/claim/${id}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        setSelectedId(id);
        await loadConversations();
        await loadQueue();
      }
    } finally {
      setLoading(false);
    }
  }

  async function transfer() {
    if (!selectedId || !transferTo) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/queue/transfer`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ conversationId: selectedId, toAgentId: transferTo }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        setTransferTo("");
        await loadConversations();
        await loadConversation(selectedId);
      }
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(status: "online" | "away" | "offline") {
    const res = await fetch(`${API_URL}/queue/agent-status`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.error) setMyStatus(status);
  }

  async function changeRoutingMode(mode: "pull" | "auto") {
    await fetch(`${API_URL}/queue/routing-mode`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ mode }),
    });
    setRoutingMode(mode);
  }

  const me = typeof window !== "undefined" ? (() => {
    try {
      return JSON.parse(localStorage.getItem("chatty_agent") || "{}");
    } catch {
      return {};
    }
  })() : {};

  let list = conversations;
  if (filter === "mine" && me.id) {
    list = conversations.filter((c) => c.assignedAgentId === me.id && c.status === "open");
  } else if (filter === "queue") {
    list = queue;
  } else if (filter === "open") {
    list = conversations.filter((c) => c.status === "open");
  } else if (filter === "closed") {
    list = conversations.filter((c) => c.status === "closed");
  }

  const selected = conversations.find((c) => c.id === selectedId) || queue.find((c) => c.id === selectedId);

  return (
    <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
      <header className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">Chatty</span>
          <span className="text-slate-400 text-sm">לוח נציגים</span>
          <button
            onClick={() => {
              localStorage.removeItem("chatty_token");
              localStorage.removeItem("chatty_agent");
              window.location.href = "/agent/login";
            }}
            className="text-xs text-slate-400 hover:text-white"
          >
            יציאה
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={myStatus}
            onChange={(e) => changeStatus(e.target.value as any)}
            className="bg-slate-800 rounded-full px-2 py-1"
          >
            <option value="online">Online</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
          </select>
          <select
            value={routingMode}
            onChange={(e) => changeRoutingMode(e.target.value as any)}
            className="bg-slate-800 rounded-full px-2 py-1"
            title="מצב ניתוב"
          >
            <option value="pull">תור כללי (משיכה)</option>
            <option value="auto">שיוך אוטומטי</option>
          </select>
          <button
            onClick={claimNext}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full"
          >
            קח שיחה הבאה ({queue.length})
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש..."
            className="bg-slate-800 text-white placeholder-slate-400 rounded-full px-3 py-1 w-28 outline-none"
          />
          {(["mine", "queue", "open", "closed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full ${filter === f ? "bg-white text-slate-900" : "bg-slate-700"}`}
            >
              {f === "mine" ? "שלי" : f === "queue" ? "תור" : f === "open" ? "פתוחות" : f === "closed" ? "סגורות" : "הכל"}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-l border-slate-200 bg-white overflow-y-auto shrink-0">
          {list.length === 0 && (
            <p className="p-4 text-sm text-slate-400 text-center">אין שיחות</p>
          )}
          {list.map((c) => (
            <div key={c.id} className="border-b border-slate-100">
              <button
                onClick={() => {
                  setSelectedId(c.id);
                  setTranscript(null);
                }}
                className={`w-full text-right px-4 py-3 hover:bg-slate-50 transition ${
                  selectedId === c.id ? "bg-slate-100" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">
                    {c.isAnonymous ? "אנונימי" : c.customerName || "לקוח"}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      !c.assignedAgentId
                        ? "bg-amber-100 text-amber-800"
                        : c.status === "open"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {!c.assignedAgentId ? "בתור" : c.status === "open" ? "פתוח" : "סגור"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(c.createdAt).toLocaleString("he-IL")} · {c.language}
                </p>
              </button>
              {filter === "queue" && !c.assignedAgentId && (
                <div className="px-4 pb-2">
                  <button
                    onClick={() => claimSpecific(c.id)}
                    className="text-xs text-emerald-700 hover:underline"
                  >
                    קח שיחה זו
                  </button>
                </div>
              )}
            </div>
          ))}
        </aside>

        <main className="flex-1 flex flex-col">
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              בחר שיחה או לחץ &quot;קח שיחה הבאה&quot;
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {selected?.isAnonymous ? "אנונימי" : selected?.customerName || "לקוח"}
                  </p>
                  <p className="text-xs text-slate-400">{selectedId.slice(0, 8)}…</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="text-xs border rounded-lg px-2 py-1"
                  >
                    <option value="">העבר לנציג...</option>
                    {agents
                      .filter((a) => a.canHandleChat && a.id !== me.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.currentLoad}/{a.maxConcurrentChats}) · {a.status}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={transfer}
                    disabled={!transferTo || loading}
                    className="text-xs border border-slate-300 rounded-lg px-3 py-1 disabled:opacity-40"
                  >
                    העבר
                  </button>
                  {selected?.status === "open" && (
                    <button
                      onClick={closeChat}
                      disabled={loading}
                      className="text-sm bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                    >
                      סגור + תמלול
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.senderType === "agent" || m.senderType === "system" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                        m.isInternal || m.senderType === "system"
                          ? "bg-amber-50 border border-amber-200 text-amber-900"
                          : m.senderType === "agent"
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {(m.isInternal || m.senderType === "system") && (
                        <span className="text-[10px] block mb-1 opacity-70">
                          {m.senderType === "system" ? "מערכת" : "הערה פנימית"}
                        </span>
                      )}
                      {m.content}
                      <span className="block text-[10px] mt-1 opacity-60">
                        {new Date(m.createdAt).toLocaleTimeString("he-IL")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

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
