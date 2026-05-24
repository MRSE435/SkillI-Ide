"use client";

export default function TopBar({ title, setTitle, children, onMenuClick, showMenu, isMobile, onRunClick }) {
  return (
    <header className="h-14 md:h-16 border-b border-white/10 bg-[#0d0d18]/98 backdrop-blur-md px-3 md:px-5 flex items-center justify-between gap-2">

      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-2.5 min-w-0">
        {showMenu && (
          <button
            onClick={onMenuClick}
            aria-label="Toggle file explorer"
            className="shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl bg-white/8 hover:bg-white/15 border border-white/8 transition"
          >
            <span className="block w-[18px] h-[1.5px] bg-gray-300 rounded-full"></span>
            <span className="block w-[18px] h-[1.5px] bg-gray-300 rounded-full"></span>
            <span className="block w-[12px] h-[1.5px] bg-gray-300 rounded-full self-start ml-[3px]"></span>
          </button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-900/50">
            S
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-[15px] font-bold text-white leading-none">Skill IDE</h1>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-[11px] text-gray-500 outline-none focus:text-gray-200 transition-colors w-full max-w-[130px] md:max-w-[200px] truncate mt-0.5 leading-none"
              placeholder="Project title…"
            />
          </div>
        </div>
      </div>

      {/* Right: status + run + save + share */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <span className="hidden md:flex items-center gap-1.5 text-[11px] text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Ready
        </span>

        <button
          onClick={onRunClick}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/8 hover:bg-white/15 px-3 py-1.5 text-xs md:text-sm text-gray-200 hover:text-white transition"
        >
          <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span className="hidden sm:inline">Run</span>
        </button>

        {children}

        <button className="rounded-lg bg-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-black hover:bg-gray-100 transition shadow-md">
          Share
        </button>
      </div>
    </header>
  );
}