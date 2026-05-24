"use client";

export default function BottomPanel({ files, dependencies, isMobile = false, isTablet = false }) {
  const fileCount = Object.keys(files).length;
  const depCount = Object.keys(dependencies).length;

  return (
    <section className="h-full rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden shadow-xl flex flex-col">
      <div className="shrink-0 flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-3 md:px-4 py-1.5 md:py-2">
        <div className="flex gap-4 md:gap-6 text-[10px] md:text-xs">
          <button className="border-b border-violet-500 pb-1 font-semibold text-white">Console</button>
          {!isMobile && (
            <>
              <button className="text-gray-500 hover:text-gray-300 pb-1 transition">Problems</button>
              <button className="text-gray-500 hover:text-gray-300 pb-1 transition">Output</button>
            </>
          )}
        </div>
        <button className="rounded-md bg-white/8 hover:bg-white/15 px-2.5 md:px-3 py-1 text-[10px] md:text-xs text-gray-400 hover:text-white transition">
          Clear
        </button>
      </div>

      <div className={`flex-1 grid gap-3 bg-black/20 p-2 md:p-4 font-mono text-[10px] md:text-xs overflow-auto ${!isMobile && !isTablet ? "grid-cols-[1fr_300px]" : "grid-cols-1"}`}>
        <div className="space-y-1.5 text-green-400">
          <p><span className="text-green-500 mr-2">✓</span>Project loaded successfully</p>
          <p><span className="text-green-500 mr-2">✓</span>{fileCount} files available</p>
          <p><span className="text-green-500 mr-2">✓</span>{depCount} {depCount === 1 ? "dependency" : "dependencies"} installed</p>
          <p><span className="text-green-500 mr-2">✓</span>Live preview enabled</p>
        </div>
        {!isMobile && !isTablet && (
          <div className="rounded-xl border border-white/8 bg-black/30 p-3 text-gray-400">
            <p className="mb-2 text-[11px] font-semibold text-violet-400 uppercase tracking-wide">System Status</p>
            <div className="space-y-1">
              <p className="text-[11px]">Mode: <span className="text-gray-200">React Sandbox</span></p>
              <p className="text-[11px]">Runtime: <span className="text-gray-200">Sandpack Browser</span></p>
              <p className="text-[11px]">Status: <span className="text-green-400">Ready</span></p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}