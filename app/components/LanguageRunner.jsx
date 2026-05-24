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

export default function LanguageRunner({ isMobile = false }) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();
      setOutput(data.output || data.error || "No output");
    } catch (error) {
      setOutput(error.message);
    }

    setLoading(false);
  }

  return (
    <section className="rounded-xl md:rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 px-3 md:px-4 py-3 gap-2">
        <div>
          <p className="text-sm font-semibold text-white">Multi-Language Runner</p>
          <p className="text-[10px] md:text-xs text-gray-400">
            Run JavaScript, Python, and C++ using Docker
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-white/10 bg-black/30 px-2 md:px-3 py-1.5 md:py-2 text-xs text-white outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            className="rounded-lg bg-green-600 px-3 md:px-4 py-1.5 md:py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-green-700 transition"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 md:gap-4 p-2 md:p-4 flex-1`}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-48 md:h-56 resize-none rounded-xl border border-white/10 bg-black/40 p-3 md:p-4 font-mono text-xs md:text-sm text-gray-100 outline-none focus:border-violet-500 transition"
          placeholder="Write your code here..."
        />

        <pre className={`h-48 md:h-56 overflow-auto rounded-xl border border-white/10 bg-black p-3 md:p-4 text-xs md:text-sm ${output.includes("Error") ? 'text-red-400' : 'text-green-400'}`}>
          {output || "Output will appear here..."}
        </pre>
      </div>
    </section>
  );
}