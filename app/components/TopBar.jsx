export default function TopBar({ title, setTitle, children }) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0d0d18] px-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Skill IDE</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 bg-transparent text-xs text-gray-400 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button className="rounded-lg border border-white/10 px-4 py-2 text-sm">
          Run
        </button>

        {children}

        <button className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold">
          Share
        </button>
      </div>
    </header>
  );
}