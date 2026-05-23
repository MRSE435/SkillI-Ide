export default function TopBar({ title, setTitle, children }) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0d0d18]/95 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center font-bold">
          S
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">Skill IDE</h1>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-xs text-gray-400 outline-none focus:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:block text-xs text-green-400">
          ● Project Ready
        </span>

        <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
          Run
        </button>

        {children}

        <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200">
          Share
        </button>
      </div>
    </header>
  );
}