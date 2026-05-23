import DependenciesPanel from "./DependenciesPanel";

export default function FileSidebar({
  files,
  createFile,
  deleteFile,
  dependencies,
  installPackage,
}) {
  const fileList = Object.keys(files);

  function getIcon(fileName) {
    if (fileName.endsWith(".css")) return "🎨";
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "⚛️";
    if (fileName.includes("components")) return "📦";
    return "📄";
  }

  return (
    <aside className="h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10101d] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Explorer</p>
          <p className="text-[11px] text-gray-500">{fileList.length} files</p>
        </div>

        <button
          onClick={createFile}
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
        >
          + New
        </button>
      </div>

      <div className="h-[calc(100%-170px)] overflow-auto p-3">
        <div className="mb-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-gray-300">
          ▾ 📁 src
        </div>

        <div className="space-y-1">
          {fileList.map((fileName) => (
            <div
              key={fileName}
              className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
            >
              <span className="truncate">
                <span className="mr-2">{getIcon(fileName)}</span>
                {fileName.replace("/src/", "")}
              </span>

              <button
                onClick={() => deleteFile(fileName)}
                className="opacity-0 text-red-400 transition group-hover:opacity-100 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <DependenciesPanel
        dependencies={dependencies}
        installPackage={installPackage}
      />
    </aside>
  );
}