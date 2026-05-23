export default function BottomPanel({ files, dependencies }) {
  const fileCount = Object.keys(files).length;
  const dependencyCount = Object.keys(dependencies).length;

  return (
    <section className="h-full rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2">
        <div className="flex gap-6 text-xs">
          <button className="border-b border-violet-500 pb-1 font-semibold text-white">
            Console
          </button>
          <button className="text-gray-400 hover:text-white">Problems</button>
          <button className="text-gray-400 hover:text-white">Output</button>
        </div>

        <button className="rounded-md bg-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/20">
          Clear
        </button>
      </div>

      <div className="grid h-[calc(100%-37px)] grid-cols-[1fr_360px] gap-4 bg-black/30 p-4 font-mono text-xs">
        <div className="space-y-2 text-green-400">
          <p>✓ Project loaded successfully</p>
          <p>✓ {fileCount} files available</p>
          <p>✓ {dependencyCount} dependencies installed</p>
          <p>✓ Live preview enabled</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-gray-300">
          <p className="mb-2 text-violet-400">System Status</p>
          <p>Mode: React Sandbox</p>
          <p>Runtime: Sandpack Browser Runtime</p>
          <p>Status: Ready</p>
        </div>
      </div>
    </section>
  );
}