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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function loadLatestProject() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.success && data.projects.length > 0) {
          const latestProject = data.projects[0];
          setTitle(latestProject.title || "React Sandbox Project");
          setFiles(normalizeFiles(latestProject.files || starterFiles));
          setDependencies(latestProject.dependencies || {});
        } else {
          setFiles(normalizeFiles(starterFiles));
        }
        setProjectVersion((prev) => prev + 1);
      } catch (error) {
        console.log("Project load failed:", error);
        setFiles(normalizeFiles(starterFiles));
      } finally {
        setLoading(false);
      }
    }
    loadLatestProject();
  }, []);

  function createFile() {
    let fileName = prompt("Enter file path, example: /src/components/Card.js");
    if (!fileName) return;
    if (!fileName.startsWith("/")) fileName = "/" + fileName;
    if (!fileName.startsWith("/src/")) fileName = "/src" + fileName;
    if (files[fileName]) {
      alert("File already exists");
      return;
    }
    setFiles({
      ...files,
      [fileName]: {
        code: `export default function Component() {
  return <div>New Component</div>;
}`,
      },
    });
    setProjectVersion((prev) => prev + 1);
    setIsSidebarOpen(false); // Close sidebar on mobile after creating file
  }

  function deleteFile(fileName) {
    if (
      fileName === "/src/App.js" ||
      fileName === "/src/main.js" ||
      fileName === "/src/styles.css"
    ) {
      alert("You cannot delete important starter files");
      return;
    }
    const updatedFiles = { ...files };
    delete updatedFiles[fileName];
    setFiles(updatedFiles);
    setProjectVersion((prev) => prev + 1);
  }

  function installPackage(packageName) {
    setDependencies({
      ...dependencies,
      [packageName]: "latest",
    });
    setProjectVersion((prev) => prev + 1);
  }

  if (loading) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#080812] text-white">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          Loading project...
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
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobile={isMobile}
          >
            <SaveProjectButton title={title} dependencies={dependencies} />
          </TopBar>
        </div>

        {/* Mode Switcher */}
        <div className="absolute left-0 right-0 top-14 md:top-16 h-[56px] border-b border-white/10 bg-[#0b0b16] px-2 md:px-4 z-10">
          <div className="flex h-full items-center justify-between">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setMode("sandbox")}
                className={`rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition ${
                  mode === "sandbox"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                React Sandbox
              </button>
              <button
                onClick={() => setMode("runner")}
                className={`rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition ${
                  mode === "runner"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Test Language
              </button>
            </div>
            <p className="hidden md:block text-xs text-gray-500">
              Build, preview and test apps directly in browser
            </p>
          </div>
        </div>

        {/* Main Content */}
        <section className="absolute inset-x-0 bottom-0 top-[110px] md:top-[120px] overflow-hidden p-2 md:p-4">
          {mode === "sandbox" && (
            <>
              {/* Mobile Sidebar Overlay */}
              {isMobile && isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/70 z-30"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              
              <div
                className="grid h-full gap-2 md:gap-4"
                style={{
                  gridTemplateRows: isMobile 
                    ? "1fr 200px" 
                    : "minmax(0,1fr) 220px",
                }}
              >
                <div
                  className="grid min-h-0 gap-2 md:gap-4"
                  style={{
                    gridTemplateColumns: isMobile 
                      ? "1fr" 
                      : "260px minmax(0,1fr) 1fr",
                  }}
                >
                  {/* File Sidebar - Mobile conditional */}
                  {(isMobile && isSidebarOpen) ? (
                    <div className="fixed left-0 top-0 h-full w-80 bg-[#0b0b16] border-r border-white/10 z-40 shadow-2xl animate-slideIn">
                      <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold">Files</h3>
                        <button 
                          onClick={() => setIsSidebarOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕
                        </button>
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
                  ) : (
                    !isMobile && (
                      <FileSidebar
                        files={files}
                        createFile={createFile}
                        deleteFile={deleteFile}
                        dependencies={dependencies}
                        installPackage={installPackage}
                        isMobile={false}
                      />
                    )
                  )}
                  
                  <EditorPanel isMobile={isMobile} />
                  <PreviewPanel isMobile={isMobile} />
                </div>
                
                <BottomPanel files={files} dependencies={dependencies} isMobile={isMobile} />
              </div>
            </>
          )}
          {mode === "runner" && <LanguageRunner isMobile={isMobile} />}
        </section>
      </SandpackProvider>
    </main>
  );
}