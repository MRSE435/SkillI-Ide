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
        Loading project...
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
        }}
        customSetup={{
          entry: "/src/main.js",
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            ...dependencies,
          },
        }}
      >
        <div className="absolute left-0 right-0 top-0 h-16">
          <TopBar title={title} setTitle={setTitle}>
            <SaveProjectButton title={title} dependencies={dependencies} />
          </TopBar>
        </div>

        <div className="absolute left-0 right-0 top-16 h-[56px] border-b border-white/10 bg-[#0b0b16] px-4">
          <div className="flex h-full items-center justify-between">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setMode("sandbox")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  mode === "sandbox"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400"
                }`}
              >
                React Sandbox
              </button>
              <button
                onClick={() => setMode("runner")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  mode === "runner"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400"
                }`}
              >
                Test Language
              </button>
            </div>
            <p className="hidden text-xs text-gray-500 md:block">
              Build, preview and test apps directly in browser
            </p>
          </div>
        </div>

        <section className="absolute inset-x-0 bottom-0 top-[120px] overflow-hidden p-4">
          {mode === "sandbox" && (
            <div
              className="grid h-full gap-4"
              style={{
                gridTemplateRows: "minmax(0,1fr) 220px",
              }}
            >
              <div
                className="grid min-h-0 gap-4"
                style={{
                  gridTemplateColumns: "260px minmax(0,1fr) 1fr",
                }}
              >
                <FileSidebar
                  files={files}
                  createFile={createFile}
                  deleteFile={deleteFile}
                  dependencies={dependencies}
                  installPackage={installPackage}
                />
                <EditorPanel />
                <PreviewPanel />
              </div>
              <BottomPanel files={files} dependencies={dependencies} />
            </div>
          )}
          {mode === "runner" && <LanguageRunner />}
        </section>
      </SandpackProvider>
    </main>
  );
}