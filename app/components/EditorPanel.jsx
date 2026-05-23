import { SandpackCodeEditor } from "@codesandbox/sandpack-react";

export default function EditorPanel() {
  return (
    <section className="h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10101d] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Code Editor</p>
          <p className="text-[11px] text-gray-500">Live React workspace</p>
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-medium text-green-400">
          ● Live
        </span>
      </div>

      <div className="h-[calc(100%-57px)] overflow-hidden">
        <SandpackCodeEditor
          showTabs
          showLineNumbers
          showRunButton
          closableTabs={false}
          style={{
            height: "100%",
          }}
        />
      </div>
    </section>
  );
}