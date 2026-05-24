"use client";

import { SandpackPreview } from "@codesandbox/sandpack-react";
import { useState, useEffect } from "react";

const devices = {
  desktop: {
    name: "Desktop",
    icon: "🖥️",
    width: "100%",
    height: "100%",
    rounded: "0px"
  },
  tablet: {
    name: "Tablet",
    icon: "📱",
    width: "768px",
    height: "900px",
    rounded: "12px"
  },
  mobile: {
    name: "Mobile", 
    icon: "📱",
    width: "375px",
    height: "667px",
    rounded: "20px"
  }
};

export default function PreviewPanel({ isMobile = false }) {
  const [device, setDevice] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-select mobile view on mobile devices
  useEffect(() => {
    if (isMobile) {
      setDevice("mobile");
    }
  }, [isMobile]);

  const currentDevice = devices[device];
  
  let displayWidth = currentDevice.width;
  let displayHeight = currentDevice.height;
  
  if (orientation === "landscape" && device !== "desktop" && !isMobile) {
    displayWidth = currentDevice.height;
    displayHeight = currentDevice.width;
  }

  // Auto refresh after loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-white/10 px-2 md:px-4 py-2 md:py-3 bg-[#0b0b16]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs md:text-sm font-semibold text-white">Live Preview</p>
          
          <div className="flex gap-1 md:gap-2 flex-wrap">
            {!isMobile && (
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="px-2 md:px-3 py-1 md:py-1.5 text-xs rounded-md bg-violet-600 text-white hover:bg-violet-700 transition flex items-center gap-1"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Run</span>
              </button>
            )}
            
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setDevice("desktop")}
                className={`px-1.5 md:px-3 py-1 text-[10px] md:text-xs rounded-md transition ${
                  device === "desktop"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>🖥️</span>
                <span className="hidden sm:inline ml-1">Desktop</span>
              </button>
              
              <button
                onClick={() => setDevice("tablet")}
                className={`px-1.5 md:px-3 py-1 text-[10px] md:text-xs rounded-md transition ${
                  device === "tablet"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>📱</span>
                <span className="hidden sm:inline ml-1">Tablet</span>
              </button>
              
              <button
                onClick={() => setDevice("mobile")}
                className={`px-1.5 md:px-3 py-1 text-[10px] md:text-xs rounded-md transition ${
                  device === "mobile"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>📱</span>
                <span className="hidden sm:inline ml-1">Mobile</span>
              </button>
            </div>

            {device !== "desktop" && !isMobile && (
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setOrientation("portrait")}
                  className={`px-2 md:px-3 py-1 text-xs rounded-md transition ${
                    orientation === "portrait"
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setOrientation("landscape")}
                  className={`px-2 md:px-3 py-1 text-xs rounded-md transition ${
                    orientation === "landscape"
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Landscape
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto p-2 md:p-6 flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="bg-[#10101d] rounded-lg p-3 md:p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
              <p className="text-xs md:text-sm text-white">Loading preview...</p>
            </div>
          </div>
        )}
        
        <div 
          className="relative transition-all duration-300"
          style={{
            width: isMobile ? "100%" : displayWidth,
            height: isMobile ? "500px" : displayHeight,
            borderRadius: isMobile ? "12px" : currentDevice.rounded,
            boxShadow: device !== "desktop" && !isMobile 
              ? "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 8px #1a1a1a, 0 0 0 12px #2a2a2a"
              : "none",
            overflow: "hidden",
            backgroundColor: "#fff"
          }}
        >
          {/* Device Notch for Mobile */}
          {device === "mobile" && orientation === "portrait" && !isMobile && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-10">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-800 rounded-full"></div>
            </div>
          )}
          
          {/* The actual preview with key for refresh */}
          <SandpackPreview
            key={refreshKey}
            showNavigator={device === "desktop"}
            showOpenInCodeSandbox={false}
            showRefreshButton={!isMobile}
            onLoad={() => setIsLoading(false)}
            style={{ 
              width: "100%", 
              height: "100%", 
              border: "none",
              borderRadius: currentDevice.rounded
            }}
          />
          
          {/* Home Indicator for Mobile */}
          {device === "mobile" && !isMobile && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gray-400 rounded-full opacity-50"></div>
          )}
        </div>
      </div>

      {/* Device Info */}
      {device !== "desktop" && !isMobile && (
        <div className="border-t border-white/10 px-4 py-2 bg-[#0b0b16] text-xs text-gray-400 text-center">
          {device === "mobile" ? "📱 iPhone 14 Pro" : "📱 iPad Pro"} • {orientation === "portrait" ? "Portrait" : "Landscape"} • {displayWidth} × {displayHeight}
        </div>
      )}
    </section>
  );
}