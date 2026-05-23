"use client";

import { useState } from "react";

const starterCode = {
  javascript: `console.log("Hello from JavaScript");`,

  python: `print("Hello from Python")`,

  cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello from C++";
  return 0;
}`,
};

export default function LanguageRunner() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(starterCode.javascript);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  function changeLanguage(newLanguage) {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage]);
    setOutput("");
  }

  async function runCode() {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const data = await response.json();

      setOutput(data.output || data.error || "No output");
    } catch (error) {
      setOutput(error.message);
    }

    setLoading(false);
  }

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Multi-Language Runner</p>
          <p className="text-xs text-gray-400">
            Run JavaScript, Python, and C++ using Docker
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-56 resize-none rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-gray-100 outline-none"
        />

        <pre className="h-56 overflow-auto rounded-xl border border-white/10 bg-black p-4 text-sm text-green-400">
          {output || "Output will appear here..."}
        </pre>
      </div>
    </section>
  );
}