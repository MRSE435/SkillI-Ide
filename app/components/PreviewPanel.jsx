import { SandpackPreview } from "@codesandbox/sandpack-react";
import { useState } from "react";

const devices = {
  desktop: { width: "100%", height: "100%", label: "Desktop" },
  tablet: { width: "768px", height: "100%", label: "Tablet" },
  mobile: { width: "375px", height: "100%", label: "Mobile" }
};

export default function PreviewPanel() {
  const [device, setDevice] = useState("desktop");

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden flex flex-col h-full">
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Live Preview</p>
        <div className="flex gap-2 bg-white/5 rounded-lg p-1">
          {Object.entries(devices).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`px-3 py-1 text-xs rounded-md transition ${
                device === key
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white overflow-auto flex items-center justify-center p-4">
        <div
          style={{
            width: devices[device].width,
            height: devices[device].height,
            transition: "all 0.2s ease",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "white"
          }}
        >
          <SandpackPreview
            showNavigator={false}
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </section>
  );
}