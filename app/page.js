"use client";

import { useEffect, useState } from "react";
import { SandpackProvider } from "@codesandbox/sandpack-react";

import TopBar from "./components/TopBar";
import FileSidebar from "./components/FileSidebar";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import LanguageRunner from "./components/LanguageRunner";
import SaveProjectButton from "./components/SaveProjectButton";
import { starterFiles } from "./data/starterFiles";
import BottomPanel from "./components/BottomPanel";
export default function Home() {
  const [files, setFiles] = useState(starterFiles);
  const [dependencies, setDependencies] = useState({});
  const [title, setTitle] = useState("React Sandbox Project");
  const [mode, setMode] = useState("sandbox");

  useEffect(() => {
    async function loadLatestProject() {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success && data.projects.length > 0) {
        const latestProject = data.projects[0];

        setTitle(latestProject.title || "React Sandbox Project");
        setFiles(latestProject.files || starterFiles);
        setDependencies(latestProject.dependencies || {});
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
  }

  function installPackage(packageName) {
    setDependencies({
      ...dependencies,
      [packageName]: "latest",
    });
  }

  return (
    <main className="h-screen overflow-hidden bg-[#080812] text-white">
      <SandpackProvider
        template="react"
        theme="dark"
        files={files}
        options={{
          visibleFiles: Object.keys(files),
          activeFile: "/src/App.js",
        }}
        customSetup={{
          entry: "/src/main.js",
          dependencies,
        }}
      >
        <TopBar title={title} setTitle={setTitle}>
          <SaveProjectButton title={title} dependencies={dependencies} />
        </TopBar>

        <div className="flex items-center gap-3 border-b border-white/10 bg-[#0b0b16] px-4 py-3">
          <button
            onClick={() => setMode("sandbox")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === "sandbox"
                ? "bg-violet-600 text-white"
                : "bg-white/10 text-gray-300"
              }`}
          >
            React Sandbox
          </button>

          <button
            onClick={() => setMode("runner")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === "runner"
                ? "bg-violet-600 text-white"
                : "bg-white/10 text-gray-300"
              }`}
          >
            Test Language
          </button>
        </div>

        <section className="h-[calc(100vh-160px)] overflow-hidden p-4">
          {mode === "sandbox" && (
            <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_230px] gap-4">
              <div
                className="grid min-h-0 gap-4"
                style={{
                  gridTemplateColumns: "260px minmax(0, 1fr) 470px",
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