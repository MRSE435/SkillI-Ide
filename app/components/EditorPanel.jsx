import { SandpackCodeEditor } from "@codesandbox/sandpack-react";

export default function EditorPanel() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold">Code Editor</p>
      </div>

      <div className="h-[calc(100%-45px)]">
        <SandpackCodeEditor showLineNumbers showTabs />
      </div>
    </section>
  );
}