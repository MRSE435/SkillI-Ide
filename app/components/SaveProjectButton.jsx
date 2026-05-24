"use client";

import { useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { normalizeFiles } from "../utils/normalizeFiles";

export default function SaveProjectButton({ title, dependencies }) {
  const { sandpack } = useSandpack();
  const [saving, setSaving] = useState(false);

  async function saveProject() {
    setSaving(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        files: normalizeFiles(sandpack.files),
        dependencies,
      }),
    });

    const data = await response.json();
    console.log(data);

    setSaving(false);

    alert(data.success ? "Project saved successfully" : "Failed to save project");
  }

  return (
    <button
      onClick={saveProject}
      disabled={saving}
      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </button>
  );
}