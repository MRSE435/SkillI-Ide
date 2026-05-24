"use client";

import { SandpackPreview } from "@codesandbox/sandpack-react";
import { useState, useEffect } from "react";

const DEVICES = {
  desktop: { label: "Desktop", icon: "🖥️", width: "100%",  height: "100%",  radius: "0px"  },
  tablet:  { label: "Tablet",  icon: "⬛",  width: "768px", height: "900px", radius: "12px" },
  mobile:  { label: "Mobile",  icon: "📱", width: "375px", height: "667px", radius: "20px" },
};

export default function PreviewPanel({
  isMobile = false,
  isTablet = false,
  externalFullscreen = false,
  onExternalFullscreenChange,
}) {
  const [device, setDevice] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [internalFullscreen, setInternalFullscreen] = useState(false);

  const isFullscreen = externalFullscreen || internalFullscreen;
  const closeFullscreen = () => {
    setInternalFullscreen(false);
    onExternalFullscreenChange?.(false);
  };

  const isSmall = isMobile || isTablet;

  useEffect(() => { if (isMobile) setDevice("mobile"); }, [isMobile]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") closeFullscreen(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  useEffect(() => {
    const t = setTimeout(() => setRefreshKey((k) => k + 1), 1000);
    return () => clearTimeout(t);
  }, []);

  const cur = DEVICES[device];
  let dW = cur.width, dH = cur.height;
  if (orientation === "landscape" && device !== "desktop" && !isSmall) {
    [dW, dH] = [dH, dW];
  }

  const DevicePicker = () => (
    <div className="flex gap-1 bg-white/5 rounded-lg p-1">
      {Object.entries(DEVICES).map(([key, d]) => (
        <button
          key={key}
          onClick={() => setDevice(key)}
          title={d.label}
          className={`px-2 md:px-2.5 py-1 text-[10px] md:text-xs rounded-md transition-all ${
            device === key ? "bg-violet-600 text-white shadow" : "text-gray-400 hover:text-white"
          }`}
        >
          <span>{d.icon}</span>
          <span className="hidden md:inline ml-1">{d.label}</span>
        </button>
      ))}
    </div>
  );

  const OrientationPicker = () =>
    device !== "desktop" && !isSmall ? (
      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {["portrait", "landscape"].map((o) => (
          <button
            key={o}
            onClick={() => setOrientation(o)}
            className={`px-2 py-1 text-[10px] md:text-xs rounded-md transition capitalize ${
              orientation === o ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {o === "portrait" ? "↕" : "↔"}
            <span className="hidden md:inline ml-1">{o}</span>
          </button>
        ))}
      </div>
    ) : null;

  const RefreshBtn = () => (
    <button
      onClick={() => setRefreshKey((k) => k + 1)}
      title="Refresh preview"
      className="flex items-center gap-1 rounded-md bg-violet-600/80 hover:bg-violet-600 text-white transition border border-violet-500/30 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs"
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      <span className="hidden sm:inline">Run</span>
    </button>
  );

  const FullscreenBtn = ({ active }) => (
    <button
      onClick={() => active ? closeFullscreen() : setInternalFullscreen(true)}
      title={active ? "Exit fullscreen" : "Fullscreen preview"}
      className={`flex items-center gap-1 rounded-md transition border px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs ${
        active
          ? "bg-red-600/20 border-red-500/20 text-red-400 hover:bg-red-600/30"
          : "bg-white/8 border-white/8 text-gray-300 hover:bg-white/18 hover:text-white"
      }`}
    >
      {active ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
        </svg>
      )}
      <span className="hidden sm:inline">{active ? "Close" : "Fullscreen"}</span>
    </button>
  );

  const PreviewFrame = ({ fullscreen = false }) => {
    const frameW = isSmall ? "100%" : dW;
    const frameH = isSmall || fullscreen ? "100%" : dH;
    const frameR = isSmall ? "8px" : cur.radius;
    const shadow = device !== "desktop" && !isSmall
      ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 6px #1a1a2e, 0 0 0 10px #252540"
      : "none";

    return (
      <div
        className="relative transition-all duration-300"
        style={{ width: frameW, height: frameH, borderRadius: frameR, boxShadow: shadow, overflow: "hidden", backgroundColor: "#fff", maxWidth: "100%", maxHeight: "100%" }}
      >
        {device === "mobile" && orientation === "portrait" && !isSmall && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-b-2xl z-10">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-2.5 bg-gray-800 rounded-full"></div>
          </div>
        )}
        <SandpackPreview
          key={fullscreen ? `fs-${refreshKey}` : refreshKey}
          showNavigator={device === "desktop"}
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          onLoad={() => setIsLoading(false)}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
        {device === "mobile" && !isSmall && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-500 rounded-full opacity-40"></div>
        )}
      </div>
    );
  };

  /* ── Fullscreen overlay ── */
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080812] flex flex-col">
        <div className="shrink-0 border-b border-white/10 bg-[#0d0d1a] px-3 md:px-5 py-2 md:py-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-white">Live Preview</p>
            <p className="text-[10px] text-gray-500">
              {isMobile ? "Tap × to close" : "ESC or × to exit fullscreen"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <DevicePicker />
            <OrientationPicker />
            <RefreshBtn />
            <FullscreenBtn active={true} />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gradient-to-br from-[#0d0d1a] to-[#080812] flex items-center justify-center p-4 md:p-8">
          <PreviewFrame fullscreen />
        </div>

        {device !== "desktop" && !isMobile && (
          <div className="shrink-0 border-t border-white/10 bg-[#0d0d1a] px-4 py-1.5 text-[10px] text-gray-500 text-center">
            {device === "mobile" ? "📱 iPhone 14 Pro" : "📱 iPad Pro"} &bull;{" "}
            {orientation === "portrait" ? "Portrait" : "Landscape"} &bull; {dW} × {dH}
          </div>
        )}
        <div className="shrink-0 border-t border-white/10 bg-[#0d0d1a] px-4 py-1.5 text-[10px] text-gray-500 text-center">
          {isMobile ? "Tap × to exit" : "⌨️ ESC to exit · Switch device views above"}
        </div>
      </div>
    );
  }

  /* ── Normal panel ── */
  return (
    <section className="rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden flex flex-col h-full">
      <div className="shrink-0 border-b border-white/10 px-3 md:px-4 py-2 md:py-2.5 bg-[#0b0b16]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs md:text-sm font-semibold text-white shrink-0">Live Preview</p>
          <div className="flex gap-1.5 items-center flex-wrap justify-end">
            <RefreshBtn />
            {!isSmall && <DevicePicker />}
            {!isSmall && <OrientationPicker />}
            <FullscreenBtn active={false} />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-[#111120] to-[#0d0d1a] overflow-auto p-2 md:p-5 flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-sm">
            <div className="bg-[#10101d] border border-white/10 rounded-xl p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500 mx-auto mb-2"></div>
              <p className="text-xs text-gray-400">Loading preview…</p>
            </div>
          </div>
        )}
        <PreviewFrame />
      </div>

      {device !== "desktop" && !isSmall && (
        <div className="shrink-0 border-t border-white/10 px-4 py-1.5 bg-[#0b0b16] text-[10px] text-gray-500 text-center">
          {device === "mobile" ? "📱 iPhone 14 Pro" : "📱 iPad Pro"} &bull;{" "}
          {orientation === "portrait" ? "Portrait" : "Landscape"} &bull; {dW} × {dH}
        </div>
      )}
    </section>
  );
}