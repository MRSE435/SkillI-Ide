"use client";

import { useState } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";

export default function PreviewPanel() {
  const [device, setDevice] = useState("desktop");

  const devices = {
    desktop: {
      label: "Desktop",
      className: "h-full w-full rounded-xl border border-white/10",
      wrapper: "h-full w-full",
    },
    tablet: {
      label: "Tablet",
      className:
        "h-[92%] w-[390px] rounded-[26px] border-[10px] border-black shadow-2xl",
      wrapper: "h-full w-full rounded-[16px] overflow-hidden bg-white",
    },
    mobile: {
      label: "Mobile",
      className:
        "h-[92%] w-[260px] rounded-[34px] border-[8px] border-black shadow-2xl",
      wrapper: "h-full w-full rounded-[24px] overflow-hidden bg-white",
    },
  };

  return (
    <section className="h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10101d] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Live Preview</p>
          <p className="text-[11px] text-gray-500">
            Real-time browser rendering
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(devices).map((key) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`rounded-lg px-3 py-1 text-[11px] font-medium ${
                device === key
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {devices[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[calc(100%-57px)] items-center justify-center overflow-auto bg-[#0b0b16] p-4">
        <div className={`relative overflow-hidden bg-white ${devices[device].className}`}>
          {device === "mobile" && (
            <div className="absolute left-1/2 top-2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-gray-700" />
          )}

          <div className={devices[device].wrapper}>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton
              style={{
                height: "100%",
                width: "100%",
                border: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}