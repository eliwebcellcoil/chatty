"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VersionBadge } from "@/components/VersionBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@chatty.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error || !data.token) {
        setError(data.error || "שגיאה בהתחברות");
        return;
      }
      localStorage.setItem("chatty_token", data.token);
      localStorage.setItem("chatty_agent", JSON.stringify(data.agent));
      router.push("/agent");
    } catch {
      setError("לא ניתן להתחבר לשרת");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4" dir="rtl">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-slate-800">Chatty – התחברות נציג</h1>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        <div>
          <label className="text-xs text-slate-500">אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>
        <p className="text-[11px] text-slate-400 text-center">
          ברירת מחדל: admin@chatty.local / admin123
        </p>
      </form>
      <VersionBadge />
    </div>
  );
}
