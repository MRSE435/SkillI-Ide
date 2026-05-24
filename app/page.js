"use client";

import { useEffect, useState } from "react";
import { SandpackProvider } from "@codesandbox/sandpack-react";

import TopBar from "./components/TopBar";
import FileSidebar from "./components/FileSidebar";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import LanguageRunner from "./components/LanguageRunner";
import SaveProjectButton from "./components/SaveProjectButton";
import BottomPanel from "./components/BottomPanel";

import { starterFiles } from "./data/starterFiles";
import { normalizeFiles } from "./utils/normalizeFiles";

export default function Home() {
  const [files, setFiles] = useState(normalizeFiles(starterFiles));
  const [dependencies, setDependencies] = useState({});
  const [title, setTitle] = useState("React Sandbox Project");
  const [mode, setMode] = useState("sandbox");
  const [loading, setLoading] = useState(true);
  const [projectVersion, setProjectVersion] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    async function loadLatestProject() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.projects.length > 0) {
          const p = data.projects[0];
          setTitle(p.title || "React Sandbox Project");
          setFiles(normalizeFiles(p.files || starterFiles));
          setDependencies(p.dependencies || {});
        } else {
          setFiles(normalizeFiles(starterFiles));
        }
        setProjectVersion((v) => v + 1);
      } catch {
        setFiles(normalizeFiles(starterFiles));
      } finally {
        setLoading(false);
      }
    }
    loadLatestProject();
  }, []);

  function createFile() {
    let fileName = prompt("Enter file path, e.g. /src/components/Card.js");
    if (!fileName) return;
    if (!fileName.startsWith("/")) fileName = "/" + fileName;
    if (!fileName.startsWith("/src/")) fileName = "/src" + fileName;
    if (files[fileName]) { alert("File already exists"); return; }
    setFiles({
      ...files,
      [fileName]: { code: `export default function Component() {\n  return <div>New Component</div>;\n}` },
    });
    setProjectVersion((v) => v + 1);
    setIsSidebarOpen(false);
  }

  function deleteFile(fileName) {
    if (["/src/App.js", "/src/main.js", "/src/styles.css"].includes(fileName)) {
      alert("You cannot delete important starter files");
      return;
    }
    const updated = { ...files };
    delete updated[fileName];
    setFiles(updated);
    setProjectVersion((v) => v + 1);
  }

  function installPackage(packageName) {
    setDependencies({ ...dependencies, [packageName]: "latest" });
    setProjectVersion((v) => v + 1);
  }

  const useDrawer = isMobile || isTablet;

  if (loading) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#080812] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3"></div>
          <p className="text-sm text-gray-400">Loading project…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#080812] text-white">
      <SandpackProvider
        key={projectVersion}
        template="react"
        theme="dark"
        files={files}
        options={{
          visibleFiles: Object.keys(files),
          activeFile: "/src/App.js",
          recompileMode: "delayed",
          recompileDelay: 500,
          autorun: true,
        }}
        customSetup={{
          entry: "/src/main.js",
          environment: "create-react-app",
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "^5.0.1",
            ...dependencies,
          },
        }}
      >
        {/* Top Bar */}
        <div className="absolute left-0 right-0 top-0 h-14 md:h-16 z-20">
          <TopBar
            title={title}
            setTitle={setTitle}
            onMenuClick={() => setIsSidebarOpen((o) => !o)}
            showMenu={useDrawer}
            isMobile={isMobile}
            onRunClick={() => { if (isMobile || isTablet) setPreviewFullscreen(true); }}
          >
            <SaveProjectButton title={title} dependencies={dependencies} />
          </TopBar>
        </div>

        {/* Mode Switcher */}
        <div className="absolute left-0 right-0 top-14 md:top-16 h-[52px] border-b border-white/10 bg-[#0b0b16] px-3 md:px-5 z-10 flex items-center justify-between">
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
            {["sandbox", "runner"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-3 md:px-4 py-1.5 text-xs md:text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {m === "sandbox" ? "React Sandbox" : "Test Language"}
              </button>
            ))}
          </div>
          <p className="hidden lg:block text-xs text-gray-500">
            Build, preview and test apps in your browser
          </p>
        </div>

        {/* Main Content */}
        <section className="absolute inset-x-0 bottom-0 top-[110px] md:top-[116px] overflow-hidden p-2 md:p-3">
          {mode === "sandbox" && (
            <>
              {/* Drawer backdrop */}
              {useDrawer && isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Slide-in sidebar drawer */}
              {useDrawer && (
                <div
                  className={`fixed left-0 top-0 h-full w-72 bg-[#0b0b16] border-r border-white/10 z-40 shadow-2xl transition-transform duration-300 ease-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
                    <span className="text-sm font-semibold">Files</span>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/8 text-gray-400 hover:text-white hover:bg-white/15 transition text-sm"
                    >✕</button>
                  </div>
                  <FileSidebar
                    files={files}
                    createFile={createFile}
                    deleteFile={deleteFile}
                    dependencies={dependencies}
                    installPackage={installPackage}
                    isMobile={true}
                    onClose={() => setIsSidebarOpen(false)}
                  />
                </div>
              )}

              {/* Grid */}
              <div
                className="grid h-full gap-2 md:gap-3"
                style={{ gridTemplateRows: isMobile ? "1fr 170px" : "minmax(0,1fr) 195px" }}
              >
                <div
                  className="grid min-h-0 gap-2 md:gap-3"
                  style={{
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : isTablet
                      ? "1fr 1fr"
                      : "240px 1fr 1fr",
                  }}
                >
                  {!useDrawer && (
                    <FileSidebar
                      files={files}
                      createFile={createFile}
                      deleteFile={deleteFile}
                      dependencies={dependencies}
                      installPackage={installPackage}
                      isMobile={false}
                    />
                  )}
                  <EditorPanel isMobile={isMobile} isTablet={isTablet} />
                  <PreviewPanel
                    isMobile={isMobile}
                    isTablet={isTablet}
                    externalFullscreen={previewFullscreen}
                    onExternalFullscreenChange={setPreviewFullscreen}
                  />
                </div>
                <BottomPanel
                  files={files}
                  dependencies={dependencies}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </div>
            </>
          )}
          {mode === "runner" && <LanguageRunner isMobile={isMobile} />}
        </section>
      </SandpackProvider>
    </main>
  );
}