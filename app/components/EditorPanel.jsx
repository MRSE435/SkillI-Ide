"use client";

import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { useState, useEffect } from "react";

export default function EditorPanel({ isMobile = false, isTablet = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && isFullscreen) setIsFullscreen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isFullscreen]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  return (
    <>
      <section className="h-full min-h-0 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] shadow-xl flex flex-col">
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-3 md:px-4 py-2 md:py-2.5">
          <div>
            <p className="text-xs md:text-sm font-semibold text-white">Code Editor</p>
            <p className="text-[10px] md:text-[11px] text-gray-500">Live React workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 rounded-lg bg-white/8 border border-white/8 px-2 md:px-3 py-1.5 text-[10px] md:text-xs text-gray-300 hover:bg-white/18 hover:text-white transition"
              title="Fullscreen editor"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-[10px] font-medium text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Live
            </span>
            {isMobile && <span className="text-[10px] text-gray-500">Tap to edit</span>}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <SandpackCodeEditor
            showTabs={!isMobile}
            showLineNumbers={!isMobile}
            showRunButton={!isMobile}
            closableTabs={false}
            style={{ height: "100%", fontSize: isMobile ? "12px" : "14px" }}
          />
        </div>
      </section>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex flex-col">
          <div className="shrink-0 flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 md:px-5 py-2 md:py-3">
            <div>
              <p className="text-sm font-semibold text-white">Fullscreen Editor</p>
              <p className="text-[10px] text-gray-500">
                {isMobile ? "Tap × to close" : "ESC or × to exit"}
              </p>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 rounded-lg bg-red-600/20 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-600/30 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-2 md:p-4">
            <SandpackCodeEditor
              showTabs={true}
              showLineNumbers={true}
              showRunButton={true}
              closableTabs={true}
              style={{ height: "100%", width: "100%", fontSize: isMobile ? "14px" : "16px", borderRadius: "10px" }}
            />
          </div>
          <div className="shrink-0 border-t border-white/10 bg-white/[0.02] px-4 py-2 text-[10px] text-gray-500 text-center">
            {isMobile ? "📱 Swipe to scroll · Tap × to exit" : "⌨️ Ctrl+S Save · Ctrl+Space Suggestions · ESC Exit"}
          </div>
        </div>
      )}
    </>
  );
}