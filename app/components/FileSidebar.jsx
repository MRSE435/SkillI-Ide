import DependenciesPanel from "./DependenciesPanel";

export default function FileSidebar({
  files,
  createFile,
  deleteFile,
  dependencies,
  installPackage,
  isMobile = false,
  onClose = null,
}) {
  const fileList = Object.keys(files);

  function getIcon(fileName) {
    if (fileName.endsWith(".css")) return "🎨";
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "⚛️";
    if (fileName.includes("components")) return "📦";
    return "📄";
  }

  return (
    <aside className={`h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10101d] shadow-xl ${isMobile ? 'rounded-l-none' : ''}`}>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-3 md:px-4 py-2 md:py-3">
        <div>
          <p className="text-xs md:text-sm font-semibold text-white">Explorer</p>
          <p className="text-[10px] md:text-[11px] text-gray-500">{fileList.length} files</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={createFile}
            className="rounded-lg bg-violet-600 px-2 md:px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 transition"
          >
            + New
          </button>
          
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 px-2 py-1.5 text-xs text-gray-400 hover:text-white md:hidden"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100%-170px)] overflow-auto p-2 md:p-3">
        <div className="mb-2 rounded-lg bg-white/5 px-2 md:px-3 py-1.5 md:py-2 text-xs font-semibold text-gray-300">
          ▾ 📁 src
        </div>

        <div className="space-y-0.5 md:space-y-1">
          {fileList.map((fileName) => (
            <div
              key={fileName}
              className="group flex items-center justify-between rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs text-gray-300 hover:bg-white/10 transition cursor-pointer"
            >
              <span className="truncate text-xs md:text-sm">
                <span className="mr-1 md:mr-2">{getIcon(fileName)}</span>
                {fileName.replace("/src/", "")}
              </span>

              <button
                onClick={() => deleteFile(fileName)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition p-1"
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
        isMobile={isMobile}
      />
    </aside>
  );
}