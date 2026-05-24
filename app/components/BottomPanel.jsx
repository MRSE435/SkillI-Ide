export default function BottomPanel({ files, dependencies, isMobile = false }) {
  const fileCount = Object.keys(files).length;
  const dependencyCount = Object.keys(dependencies).length;

  return (
    <section className="h-full rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-2 md:px-4 py-1.5 md:py-2">
        <div className="flex gap-3 md:gap-6 text-[10px] md:text-xs">
          <button className="border-b border-violet-500 pb-1 font-semibold text-white">
            Console
          </button>
          {!isMobile && (
            <>
              <button className="text-gray-400 hover:text-white">Problems</button>
              <button className="text-gray-400 hover:text-white">Output</button>
            </>
          )}
        </div>

        <button className="rounded-md bg-white/10 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs text-gray-300 hover:bg-white/20 transition">
          Clear
        </button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-[1fr_360px]'} gap-2 md:gap-4 bg-black/30 p-2 md:p-4 font-mono text-[10px] md:text-xs`}>
        <div className="space-y-1 md:space-y-2 text-green-400 break-words">
          <p>✓ Project loaded successfully</p>
          <p>✓ {fileCount} files available</p>
          <p>✓ {dependencyCount} dependencies installed</p>
          <p>✓ Live preview enabled</p>
        </div>

        {!isMobile && (
          <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-gray-300">
            <p className="mb-2 text-violet-400 text-xs">System Status</p>
            <p className="text-[11px]">Mode: React Sandbox</p>
            <p className="text-[11px]">Runtime: Sandpack Browser Runtime</p>
            <p className="text-[11px]">Status: Ready</p>
          </div>
        )}
      </div>
    </section>
  );
}