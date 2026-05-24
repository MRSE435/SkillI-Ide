"use client";

import { useState } from "react";

export default function DependenciesPanel({ dependencies, installPackage, isMobile = false }) {
  const [packageName, setPackageName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleInstall = () => {
    if (packageName.trim()) {
      installPackage(packageName.trim());
      setPackageName("");
      setShowInput(false);
    }
  };

  return (
    <div className="border-t border-white/10 bg-black/30">
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-white">Dependencies</p>
          <button
            onClick={() => setShowInput(!showInput)}
            className="rounded-lg bg-violet-600/20 px-2 md:px-3 py-1 text-xs text-violet-400 hover:bg-violet-600/30 transition"
          >
            + Add
          </button>
        </div>

        {showInput && (
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInstall()}
              placeholder="package name"
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-2 md:px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
              autoFocus
            />
            <button
              onClick={handleInstall}
              className="rounded-lg bg-green-600 px-2 md:px-3 py-1.5 text-xs text-white hover:bg-green-700 transition"
            >
              Install
            </button>
          </div>
        )}

        <div className="max-h-32 overflow-auto space-y-1">
          {Object.keys(dependencies).length === 0 ? (
            <p className="text-[10px] text-gray-500">No dependencies installed</p>
          ) : (
            Object.entries(dependencies).map(([name, version]) => (
              <div key={name} className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-gray-300 truncate">{name}</span>
                <span className="text-gray-500">{version}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}