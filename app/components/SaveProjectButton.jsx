"use client";

import { useRef, useEffect, useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";

export default function SaveProjectButton({ title, dependencies }) {
    const { sandpack } = useSandpack();
    const [saving, setSaving] = useState(false);

    const sandpackRef = useRef(sandpack);
    useEffect(() => {
        sandpackRef.current = sandpack;
    });

    async function saveProject() {
        setSaving(true);

        const latestFiles = {};
        Object.entries(sandpackRef.current.files).forEach(([path, file]) => {
            if (path.startsWith("/src/")) {
                latestFiles[path] = { code: file.code };
            }
        });

        console.log("Saving App.js:", latestFiles["/src/App.js"]?.code);

        const response = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, files: latestFiles, dependencies }),
        });

        const data = await response.json();
        console.log(data);

        setSaving(false);
        alert(data.success ? "Project saved ✅" : "Save failed ❌");
    }

    return (
        <button
            onClick={saveProject}
            disabled={saving}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
            {saving ? "Saving..." : "Save"}
        </button>
    );
}