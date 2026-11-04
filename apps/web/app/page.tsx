import Link from "next/link";
import { VersionBadge } from "@/components/VersionBadge";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50">
      <div className="max-w-lg w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">Chatty</h1>
          <p className="mt-2 text-slate-600">מערכת צ&apos;אט תמיכה מקצועית</p>
        </div>

        <div className="grid gap-3">
          <Link
            href="/widget"
            className="block rounded-xl border border-slate-200 bg-white px-6 py-4 text-right shadow-sm hover:border-slate-400 transition"
          >
            <p className="font-medium text-slate-800">וידג&apos;ט לקוח</p>
            <p className="text-sm text-slate-500">פתיחת שיחה · שליחת הודעות · סקר</p>
          </Link>
          <Link
            href="/agent"
            className="block rounded-xl border border-slate-200 bg-white px-6 py-4 text-right shadow-sm hover:border-slate-400 transition"
          >
            <p className="font-medium text-slate-800">לוח נציגים</p>
            <p className="text-sm text-slate-500">Inbox · Canned · תמלול · הערות פנימיות</p>
          </Link>
          <Link
            href="/admin"
            className="block rounded-xl border border-slate-200 bg-white px-6 py-4 text-right shadow-sm hover:border-slate-400 transition"
          >
            <p className="font-medium text-slate-800">ניהול (Admin)</p>
            <p className="text-sm text-slate-500">נציגים · תוכן · אנליטיקה · הרשאות</p>
          </Link>
        </div>
      </div>
      <VersionBadge />
    </main>
  );
}
