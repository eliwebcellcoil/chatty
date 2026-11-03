import { getVersionString } from "@chatty/shared";

export function VersionBadge() {
  return (
    <div className="fixed bottom-2 left-2 right-2 md:left-auto md:right-4 text-center md:text-left">
      <span className="inline-block rounded-full bg-slate-800/80 px-3 py-1 text-[10px] font-mono text-slate-300 backdrop-blur">
        {getVersionString()}
      </span>
    </div>
  );
}
