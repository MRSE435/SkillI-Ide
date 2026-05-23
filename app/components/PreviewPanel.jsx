"use client";

import { useState } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";

export default function PreviewPanel() {
  const [device, setDevice] = useState("desktop");

  const devices = {
    desktop: { label: "Desktop", width: "100%", height: "100%" },
    tablet: { label: "Tablet", width: "320px", height: "520px" },
    mobile: { label: "Mobile", width: "220px", height: "520px" },
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">Live Preview</p>

        <div className="flex gap-2">
          {Object.keys(devices).map((key) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                device === key
                  ? "bg-violet-600 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {devices[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[calc(100%-45px)] bg-[#0f172a] p-4 flex justify-center items-start overflow-auto">
        <div
          className="rounded-2xl border border-white/30 bg-white overflow-hidden transition-all duration-300"
          style={{
            width: devices[device].width,
            height: devices[device].height,
          }}
        >
          <SandpackPreview
            style={{
              width: "100%",
              height: "100%",
            }}
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
          />
        </div>
      </div>
    </section>
  );
}