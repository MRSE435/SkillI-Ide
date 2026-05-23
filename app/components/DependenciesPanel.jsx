"use client";

import { useState } from "react";

export default function DependenciesPanel({ dependencies, installPackage }) {
  const [packageName, setPackageName] = useState("");

  function handleInstall() {
    if (!packageName.trim()) return;

    installPackage(packageName.trim());
    setPackageName("");
  }

  return (
    <div className="border-t border-white/10 p-3">
      <p className="mb-3 text-sm font-semibold text-white">Dependencies</p>

      <div className="space-y-2">
        {Object.keys(dependencies).map((dep) => (
          <div
            key={dep}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-300"
          >
            <span>{dep}</span>
            <span className="text-gray-500">{dependencies[dep]}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="axios"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none"
        />

        <button
          onClick={handleInstall}
          className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white"
        >
          Add
        </button>
      </div>
    </div>
  );
}