"use client";

import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { useState, useEffect } from "react";

export default function EditorPanel({ isMobile = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Normal Editor View */}
      <section className="h-full min-h-0 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-3 md:px-4 py-2 md:py-3">
          <div>
            <p className="text-xs md:text-sm font-semibold text-white">Code Editor</p>
            <p className="text-[10px] md:text-[11px] text-gray-500">Live React workspace</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Button - Always visible */}
            <button
              onClick={toggleFullscreen}
              className="rounded-lg bg-white/10 px-2 md:px-3 py-1.5 text-[10px] md:text-xs text-gray-300 hover:bg-white/20 hover:text-white transition flex items-center gap-1"
              title="Fullscreen"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="hidden sm:inline">Fullscreen</span>
            </button>

            <span className="hidden sm:inline-block rounded-full bg-green-500/10 px-2 md:px-3 py-1 text-[10px] md:text-[11px] font-medium text-green-400">
              ● Live
            </span>
            {isMobile && (
              <span className="text-[10px] text-gray-500">Tap to edit</span>
            )}
          </div>
        </div>

        <div className="h-[calc(100%-57px)] overflow-hidden">
          <SandpackCodeEditor
            showTabs={!isMobile && !isFullscreen}
            showLineNumbers={!isMobile}
            showRunButton={!isMobile}
            closableTabs={false}
            style={{
              height: "100%",
              fontSize: isMobile ? "12px" : "14px",
            }}
          />
        </div>
      </section>

      {/* Fullscreen Modal - Works on both mobile and desktop */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex flex-col">
          {/* Fullscreen Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 md:px-4 py-2 md:py-3">
            <div>
              <p className="text-xs md:text-sm font-semibold text-white">Fullscreen Editor</p>
              <p className="text-[10px] md:text-[11px] text-gray-500">
                {isMobile ? 'Tap ✕ to close' : 'Press ESC to exit'}
              </p>
            </div>
            
            <button
              onClick={toggleFullscreen}
              className="rounded-lg bg-red-600/20 px-2 md:px-3 py-1.5 text-xs text-red-400 hover:bg-red-600/30 transition flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Close</span>
            </button>
          </div>
          
          {/* Fullscreen Editor Area */}
          <div className="flex-1 overflow-hidden p-2 md:p-4">
            <SandpackCodeEditor
              showTabs={true}
              showLineNumbers={true}
              showRunButton={true}
              closableTabs={true}
              style={{
                height: "100%",
                width: "100%",
                fontSize: isMobile ? "14px" : "16px",
                borderRadius: "8px",
              }}
            />
          </div>
          
          {/* Fullscreen Footer - Keyboard shortcuts */}
          <div className="border-t border-white/10 bg-white/[0.02] px-3 md:px-4 py-2 text-[9px] md:text-[10px] text-gray-500 text-center">
            {isMobile ? (
              <span>📱 Swipe to scroll | Tap ✕ to exit</span>
            ) : (
              <span>⌨️ Keyboard Shortcuts: Ctrl+S (Save) | Ctrl+Space (Suggestions) | ESC (Exit)</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}