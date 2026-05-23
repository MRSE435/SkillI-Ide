import DependenciesPanel from "./DependenciesPanel";

export default function FileSidebar({
  files,
  createFile,
  deleteFile,
  dependencies,
  installPackage,
}) {
  const fileList = Object.keys(files);

  return (
    <aside className="flex flex-col rounded-2xl border border-white/10 bg-[#10101d] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">Explorer</p>

        <button
          onClick={createFile}
          className="text-xs rounded-md bg-violet-600 px-2 py-1 text-white"
        >
          + File
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 text-sm">
        <div className="mb-2 text-gray-400">▾ 📁 src</div>

        {fileList.map((fileName) => (
          <div
            key={fileName}
            className="ml-3 mb-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-gray-200"
          >
            <span className="truncate">
              {fileName.includes("/components/") ? "📄 " : "⚛️ "}
              {fileName.replace("/src/", "")}
            </span>

            <button
              onClick={() => deleteFile(fileName)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <DependenciesPanel
        dependencies={dependencies}
        installPackage={installPackage}
      />
    </aside>
  );
}