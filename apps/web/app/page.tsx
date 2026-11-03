import { getVersionString } from "@chatty/shared";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
          Chatty
        </h1>
        <p className="text-slate-600">
          מערכת צ'אט תמיכה מקצועית
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">שלד ראשוני – WP-01</p>
          <p className="mt-2 text-xs text-slate-400 font-mono">
            {getVersionString()}
          </p>
        </div>
      </div>
    </main>
  );
}
