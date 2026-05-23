export const starterFiles = {
  "/src/App.js": {
    code: `import "./styles.css";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="hero">
        <p className="badge">Browser-Based Sandbox</p>
        <h1>Build React projects directly in your browser.</h1>
        <p className="subtitle">
          Edit files, preview live output, and practice frontend development without local setup.
        </p>
        <button>Start Coding</button>
      </main>
    </div>
  );
}`,
  },

  "/src/main.js": {
    code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
  },

  "/src/components/Navbar.js": {
    code: `export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>Skill IDE</h2>
      <div>
        <a>Learn</a>
        <a>Build</a>
        <a>Preview</a>
      </div>
    </nav>
  );
}`,
  },

  "/src/styles.css": {
    code: `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: white;
}

.app {
  min-height: 100vh;
}

.navbar {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar div {
  display: flex;
  gap: 20px;
}

.hero {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 24px;
}

.badge {
  background: rgba(139, 92, 246, 0.18);
  color: #c4b5fd;
  padding: 8px 14px;
  border-radius: 999px;
}

.hero h1 {
  max-width: 720px;
  font-size: 48px;
  line-height: 1.1;
  margin: 0;
}

.subtitle {
  max-width: 620px;
  color: #cbd5e1;
  font-size: 18px;
}

button {
  padding: 12px 22px;
  border: none;
  border-radius: 12px;
  background: #8b5cf6;
  color: white;
  cursor: pointer;
  font-weight: bold;
}`,
  },
};