import { VersionBadge } from "@/components/VersionBadge";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
          Chatty
        </h1>
        <p className="text-slate-600 text-lg">
          מערכת צ&apos;אט תמיכה מקצועית
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">שלד ראשוני</p>
          <p className="text-slate-700 font-medium">WP-01 Foundation – הושלם</p>
          <p className="mt-4 text-xs text-slate-400">
            Frontend (Next.js) + Backend (NestJS) + Shared + Docker
          </p>
        </div>
      </div>
      <VersionBadge />
    </main>
  );
}
