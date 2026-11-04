"use client";

import { useEffect, useState } from "react";
import { VersionBadge } from "@/components/VersionBadge";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function headers(): HeadersInit {
  const t = localStorage.getItem("chatty_token");
  return t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

type Tab = "analytics" | "agents" | "canned" | "roles";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("analytics");
  const [analytics, setAnalytics] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [canned, setCanned] = useState<any[]>([]);
  const [roles, setRoles] = useState<any>(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // New agent form
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
    maxConcurrentChats: 3,
  });
  // New canned form
  const [newCanned, setNewCanned] = useState({
    title: "",
    content: "",
    language: "he",
    category: "general",
  });

  useEffect(() => {
    if (!localStorage.getItem("chatty_token")) {
      window.location.href = "/agent/login";
    }
  }, []);

  async function load() {
    setError("");
    try {
      if (tab === "analytics") {
        const r = await fetch(`${API}/admin/analytics`, { headers: headers() });
        if (!r.ok) throw new Error(await r.text());
        setAnalytics(await r.json());
      } else if (tab === "agents") {
        const r = await fetch(`${API}/admin/agents`, { headers: headers() });
        if (!r.ok) throw new Error(await r.text());
        setAgents(await r.json());
      } else if (tab === "canned") {
        const r = await fetch(`${API}/admin/canned`, { headers: headers() });
        if (!r.ok) throw new Error(await r.text());
        setCanned(await r.json());
      } else if (tab === "roles") {
        const r = await fetch(`${API}/admin/roles`, { headers: headers() });
        if (!r.ok) throw new Error(await r.text());
        setRoles(await r.json());
      }
    } catch (e: any) {
      setError("אין הרשאה או שגיאה בטעינה");
    }
  }

  useEffect(() => {
    load();
  }, [tab]);

  async function createAgent(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(`${API}/admin/agents`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(newAgent),
    });
    if (!r.ok) {
      setError("יצירת נציג נכשלה");
      return;
    }
    setMsg("נציג נוצר");
    setNewAgent({ name: "", email: "", password: "", role: "agent", maxConcurrentChats: 3 });
    load();
  }

  async function createCanned(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(`${API}/admin/canned`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(newCanned),
    });
    if (!r.ok) {
      setError("יצירת תגובה נכשלה");
      return;
    }
    setMsg("תגובה נוצרה");
    setNewCanned({ title: "", content: "", language: "he", category: "general" });
    load();
  }

  async function deleteCanned(id: string) {
    if (!confirm("למחוק?")) return;
    await fetch(`${API}/admin/canned/${id}`, { method: "DELETE", headers: headers() });
    load();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "analytics", label: "אנליטיקה" },
    { id: "agents", label: "נציגים" },
    { id: "canned", label: "תוכן (Canned)" },
    { id: "roles", label: "תפקידים והרשאות" },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">Chatty Admin</span>
          <Link href="/agent" className="text-xs text-slate-300 hover:text-white">
            ← לוח נציגים
          </Link>
        </div>
        <div className="flex gap-2 text-xs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1 rounded-full ${tab === t.id ? "bg-white text-slate-900" : "bg-slate-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        {msg && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{msg}</p>}

        {tab === "analytics" && analytics && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="שיחות סה״כ" value={analytics.conversations?.total} />
            <Card title="פתוחות" value={analytics.conversations?.open} />
            <Card title="בתור (לא משויך)" value={analytics.conversations?.unassigned} />
            <Card title="נסגרו" value={analytics.conversations?.closed} />
            <Card title="24 שעות אחרונות" value={analytics.conversations?.last24h} />
            <Card title="7 ימים" value={analytics.conversations?.last7d} />
            <Card title="הודעות" value={analytics.messages?.total} />
            <Card title="דירוג ממוצע" value={analytics.surveys?.avgRating ?? "—"} />
            <Card title="נציגים Online" value={`${analytics.agents?.online}/${analytics.agents?.total}`} />
            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border p-4">
              <p className="text-sm font-medium mb-2">התפלגות דירוגי סקר</p>
              <div className="flex gap-3">
                {analytics.surveys?.distribution?.map((d: any) => (
                  <div key={d.rating} className="text-center">
                    <div className="text-lg font-bold">{d.count}</div>
                    <div className="text-xs text-slate-500">{d.rating}★</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div className="space-y-6">
            <form onSubmit={createAgent} className="bg-white rounded-xl border p-4 grid sm:grid-cols-2 gap-3">
              <h2 className="sm:col-span-2 font-medium">הוספת נציג</h2>
              <input
                placeholder="שם"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm"
                required
              />
              <input
                placeholder="אימייל"
                type="email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm"
                required
              />
              <input
                placeholder="סיסמה"
                type="password"
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm"
                required
              />
              <select
                value={newAgent.role}
                onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="agent">נציג</option>
                <option value="admin">אדמין</option>
                <option value="content">ניהול תוכן</option>
                <option value="super_admin">אדמין על</option>
              </select>
              <input
                type="number"
                min={1}
                max={20}
                value={newAgent.maxConcurrentChats}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, maxConcurrentChats: Number(e.target.value) })
                }
                className="border rounded-lg px-3 py-2 text-sm"
                placeholder="קיבולת"
              />
              <button type="submit" className="bg-slate-800 text-white rounded-lg py-2 text-sm">
                צור נציג
              </button>
            </form>

            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-right">
                  <tr>
                    <th className="p-3">שם</th>
                    <th className="p-3">אימייל</th>
                    <th className="p-3">תפקיד</th>
                    <th className="p-3">סטטוס</th>
                    <th className="p-3">קיבולת</th>
                    <th className="p-3">צ׳אט</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="p-3">{a.name}</td>
                      <td className="p-3">{a.email}</td>
                      <td className="p-3">{a.role}</td>
                      <td className="p-3">{a.status}</td>
                      <td className="p-3">{a.maxConcurrentChats}</td>
                      <td className="p-3">{a.canHandleChat ? "כן" : "לא"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "canned" && (
          <div className="space-y-6">
            <form onSubmit={createCanned} className="bg-white rounded-xl border p-4 space-y-3">
              <h2 className="font-medium">תגובה קבועה חדשה</h2>
              <input
                placeholder="כותרת"
                value={newCanned.title}
                onChange={(e) => setNewCanned({ ...newCanned, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />
              <textarea
                placeholder="תוכן"
                value={newCanned.content}
                onChange={(e) => setNewCanned({ ...newCanned, content: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm h-24"
                required
              />
              <div className="flex gap-2">
                <select
                  value={newCanned.language}
                  onChange={(e) => setNewCanned({ ...newCanned, language: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="he">עברית</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="ru">Русский</option>
                </select>
                <input
                  placeholder="קטגוריה"
                  value={newCanned.category}
                  onChange={(e) => setNewCanned({ ...newCanned, category: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <button type="submit" className="bg-slate-800 text-white rounded-lg px-4 text-sm">
                  שמור
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {canned.map((c) => (
                <div key={c.id} className="bg-white border rounded-xl p-4 flex justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">
                      {c.title}{" "}
                      <span className="text-xs text-slate-400">
                        · {c.language} · {c.category}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{c.content}</p>
                  </div>
                  <button
                    onClick={() => deleteCanned(c.id)}
                    className="text-xs text-red-600 shrink-0"
                  >
                    מחק
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "roles" && roles && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {roles.roles?.map((r: any) => (
                <div key={r.id} className="bg-white border rounded-xl p-4">
                  <p className="font-medium">{r.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{r.id}</p>
                  <p className="text-sm text-slate-600 mt-2">{r.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(roles.permissions?.[r.id] || []).map((p: string) => (
                      <span
                        key={p}
                        className="text-[10px] bg-slate-100 rounded px-2 py-0.5 font-mono"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <VersionBadge />
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1 text-slate-800">{value}</p>
    </div>
  );
}
