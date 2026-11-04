"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { VersionBadge } from "@/components/VersionBadge";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function headers(): HeadersInit {
  const t = typeof window !== "undefined" ? localStorage.getItem("chatty_token") : null;
  return t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export default function ShiftDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/shift`, { headers: headers() });
      if (r.status === 401 || r.status === 403) {
        setError("אין הרשאה – יש להתחבר כאדמין");
        setLoading(false);
        return;
      }
      if (!r.ok) throw new Error("fail");
      setData(await r.json());
      setError("");
    } catch {
      setError("לא ניתן לטעון נתוני משמרת");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("chatty_token")) {
      window.location.href = "/agent/login";
      return;
    }
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const s = data?.summary;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">Chatty – מנהל משמרת</span>
          <Link href="/admin" className="text-xs text-slate-300 hover:text-white">
            Admin
          </Link>
          <Link href="/agent" className="text-xs text-slate-300 hover:text-white">
            לוח נציגים
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {data && (
            <span className="text-slate-400">
              ניתוב: {data.routingMode === "auto" ? "אוטומטי" : "תור כללי"} · עדכון{" "}
              {new Date(data.generatedAt).toLocaleTimeString("he-IL")}
            </span>
          )}
          <button
            onClick={load}
            className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full"
          >
            רענון
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        {loading && !data && (
          <p className="text-slate-400 text-center py-12">טוען...</p>
        )}

        {s && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Kpi title="בתור עכשיו" value={s.queueLength} alert={s.queueLength > 5} />
              <Kpi title="שיחות פתוחות" value={s.openTotal} />
              <Kpi title="נפתחו היום" value={s.openedToday} />
              <Kpi title="נסגרו היום" value={s.closedToday} />
              <Kpi
                title="המתנה מקסימלית"
                value={`${s.maxWaitMinutes} דק׳`}
                alert={s.maxWaitMinutes > 10}
              />
              <Kpi
                title="דירוג היום"
                value={s.avgRatingToday ?? "—"}
                sub={s.surveysToday ? `${s.surveysToday} סקרים` : undefined}
              />
              <Kpi
                title="נציגים Online"
                value={s.agentsOnline}
                sub={`Away ${s.agentsAway} · Offline ${s.agentsOffline}`}
              />
              <Kpi
                title="ניצולת קיבולת"
                value={
                  s.totalCapacity
                    ? `${Math.round((s.usedCapacity / s.totalCapacity) * 100)}%`
                    : "—"
                }
                sub={`${s.usedCapacity}/${s.totalCapacity}`}
              />
            </div>

            {/* Agents table */}
            <section className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 border-b font-medium text-sm">נציגים במשמרת</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-right text-xs text-slate-500">
                    <tr>
                      <th className="p-3">שם</th>
                      <th className="p-3">סטטוס</th>
                      <th className="p-3">פתוחות</th>
                      <th className="p-3">קיבולת</th>
                      <th className="p-3">ניצולת</th>
                      <th className="p-3">נסגרו היום</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.agents?.map((a: any) => (
                      <tr key={a.id} className="border-t">
                        <td className="p-3 font-medium">{a.name}</td>
                        <td className="p-3">
                          <StatusDot status={a.status} />
                        </td>
                        <td className="p-3">{a.openChats}</td>
                        <td className="p-3">
                          {a.openChats}/{a.maxConcurrentChats}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  a.utilization >= 90
                                    ? "bg-red-500"
                                    : a.utilization >= 60
                                    ? "bg-amber-400"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, a.utilization)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{a.utilization}%</span>
                          </div>
                        </td>
                        <td className="p-3">{a.closedToday}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Queue preview */}
            <section className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 border-b font-medium text-sm flex justify-between">
                <span>תור ממתין (עד 10)</span>
                <span className="text-xs text-slate-400">{s.queueLength} סה״כ</span>
              </div>
              {(!data.queuePreview || data.queuePreview.length === 0) && (
                <p className="p-4 text-sm text-slate-400">התור ריק</p>
              )}
              <ul className="divide-y">
                {data.queuePreview?.map((c: any) => {
                  const waitMin = Math.round(
                    (Date.now() - new Date(c.createdAt).getTime()) / 60000
                  );
                  return (
                    <li
                      key={c.id}
                      className="px-4 py-3 flex justify-between text-sm items-center"
                    >
                      <span>
                        {c.isAnonymous ? "אנונימי" : c.customerName || "לקוח"}{" "}
                        <span className="text-xs text-slate-400">· {c.language}</span>
                      </span>
                      <span
                        className={`text-xs ${
                          waitMin > 10 ? "text-red-600 font-medium" : "text-slate-500"
                        }`}
                      >
                        ממתין {waitMin} דק׳
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </main>
      <VersionBadge />
    </div>
  );
}

function Kpi({
  title,
  value,
  sub,
  alert,
}: {
  title: string;
  value: any;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        alert ? "border-red-300 ring-1 ring-red-100" : ""
      }`}
    >
      <p className="text-xs text-slate-500">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${alert ? "text-red-600" : "text-slate-800"}`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "online"
      ? "bg-emerald-500"
      : status === "away"
      ? "bg-amber-400"
      : "bg-slate-300";
  const label =
    status === "online" ? "Online" : status === "away" ? "Away" : "Offline";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
