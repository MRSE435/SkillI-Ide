# Skill IDE — Browser Code Editor

**Live Demo → [skill-i-ide.vercel.app](https://skill-i-ide.vercel.app/)**

A fully in-browser React IDE built with Next.js and Sandpack. Write, preview, and test React projects without any local setup — runs entirely in the browser.

---

## Features

- **Live React sandbox** — hot-reloading preview as you type
- **File explorer** — create and delete files in a virtual file system
- **Package installer** — add npm dependencies on the fly
- **Device preview** — simulate Desktop, Tablet, and Mobile viewports with orientation toggle
- **Fullscreen modes** — both the editor and preview can go fullscreen independently
- **Run → Preview** — on mobile/tablet, the Run button opens the preview fullscreen instantly
- **Project persistence** — save and load projects from MongoDB
- **Language Runner** — standalone mode for testing non-React code snippets
- **Fully responsive** — dedicated layouts for mobile, tablet, and desktop

---

## Architecture

The architecture is intentionally simple — two moving parts.

### 1. Persistence layer (MongoDB → API → state)

On mount, `page.js` calls `/api/projects` which queries MongoDB for the most recently saved project. The response shape is:

```json
{
  "title": "My Project",
  "files": { "/src/App.js": { "code": "..." } },
  "dependencies": { "lodash": "latest" }
}
```

That data gets dropped straight into React state (`files`, `dependencies`, `title`). The `SaveProjectButton` component does the reverse — it POSTs current state back to MongoDB. No versioning, no diffs, no real-time sync. Last save wins.

### 2. Sandpack (the actual IDE)

`SandpackProvider` wraps the entire app and receives `files` and `dependencies` from React state. Every component that needs IDE functionality (`SandpackCodeEditor`, `SandpackPreview`) consumes from that provider automatically — no prop drilling needed for the editor internals.

The `key={projectVersion}` prop on `SandpackProvider` forces a full remount whenever files or dependencies change externally. Without it, Sandpack wouldn't pick up changes made outside its own editor.

```
MongoDB
   ↓  GET /api/projects  (on mount)
   ↓  POST /api/projects (on save)

React state  →  SandpackProvider  (key=projectVersion)
                 ├── FileSidebar     (file list, create, delete, install packages)
                 ├── EditorPanel     (SandpackCodeEditor + fullscreen)
                 ├── PreviewPanel    (SandpackPreview + device frames + fullscreen)
                 └── BottomPanel     (console output)
```

### 3. Responsive layout

Three breakpoints managed in `page.js` via a `resize` listener:

| Breakpoint | Width       | Layout                                          |
|------------|-------------|-------------------------------------------------|
| Mobile     | < 768px     | Single column, sidebar drawer, stacked panels   |
| Tablet     | 768–1023px  | Two columns (editor \| preview), sidebar drawer |
| Desktop    | ≥ 1024px    | Three columns (sidebar \| editor \| preview)    |

`isMobile` and `isTablet` booleans are passed as props to each panel so they can adapt internally — hiding tabs, adjusting font sizes, showing or hiding controls.

### 4. Fullscreen strategy

`previewFullscreen` state lives in `page.js` (lifted up) so the TopBar's Run button can trigger preview fullscreen on mobile without `TopBar` and `PreviewPanel` knowing about each other. `EditorPanel` manages its own fullscreen state locally since nothing else needs to trigger it. Both overlay modes lock `document.body.scroll` and respond to ESC.

### 5. LanguageRunner

A separate mode that runs non-React code independently of Sandpack. It has no connection to MongoDB or the virtual file system — entirely self-contained.

---

## Project Structure

```
app/
├── page.js                    # Root layout, breakpoint detection, lifted state
├── globals.css                # Base styles, Sandpack overrides, scrollbar
├── components/
│   ├── TopBar.jsx             # Header, hamburger menu, Run button, Save/Share
│   ├── FileSidebar.jsx        # File explorer, create/delete files
│   ├── EditorPanel.jsx        # Code editor with fullscreen mode
│   ├── PreviewPanel.jsx       # Live preview with device frames and fullscreen
│   ├── BottomPanel.jsx        # Console output and system status
│   ├── DependenciesPanel.jsx  # npm package installer
│   ├── SaveProjectButton.jsx  # Saves state to MongoDB
│   └── LanguageRunner.jsx     # Standalone non-React code runner
├── data/
│   └── starterFiles.js        # Default file contents on first load
├── utils/
│   └── normalizeFiles.jsx     # Normalizes file shapes for Sandpack
└── api/
    └── projects/
        └── route.js           # GET (load) and POST (save) to MongoDB
```

---

## Technical Tradeoffs

**Sandpack instead of Monaco + custom bundler**
Sandpack gives you a fully working React environment in an iframe, npm resolution included, with no server-side execution. The tradeoff is less control — you can't customise the bundler, add real TypeScript LSP support, or deeply hook into the editor. Good enough for a sandbox, not a production IDE.

**`key` remount strategy**
Incrementing `projectVersion` to force-remount `SandpackProvider` is blunt but reliable. The alternative — using Sandpack's imperative API to update files — is fragile and underdocumented. The cost is a brief flash on every project load or package install, which is acceptable for this use case.

**MongoDB with no auth**
A single `/api/projects` endpoint reads and writes with no user authentication. Anyone with access to the deployment shares the same project storage. Fine for a personal tool or demo; needs proper auth and user scoping before going multi-user.

**Lifted `previewFullscreen` state**
Lives in `page.js` so the Run button in `TopBar` can open `PreviewPanel`'s fullscreen without the two sibling components communicating directly. Small prop drilling cost, cleaner than a context or event bus for something this contained.

**No autosave**
Changes are lost on refresh unless the user clicks Save. A `localStorage` draft or debounced autosave would help but adds edge cases around stale drafts conflicting with loaded projects.

---

## Known Limitations

- **No autosave** — refreshing without saving loses all unsaved changes.
- **Single project slot** — only the most recently saved project is stored. No project list, branching, or history.
- **No authentication** — all users share the same MongoDB storage. Not suitable for multi-user deployments without auth.
- **Sandpack cold start** — the first load can take 5–10 seconds while Sandpack fetches npm packages and boots the in-browser bundler. No meaningful progress indicator exists for this phase.
- **Package install is not auto-saved** — installing a package updates state and remounts Sandpack, but won't persist to MongoDB until the user explicitly saves.
- **No TypeScript** — the `create-react-app` Sandpack template runs plain JS/JSX only. Switching templates would require migrating all starter files and handling `.ts`/`.tsx` extensions.
- **No file rename** — files can be created and deleted but not renamed. Renaming would require rewriting import paths across other files, which needs AST-level transforms.
- **Mobile keyboard conflicts with fixed layout** — the native soft keyboard resizes the viewport in ways that interact poorly with `position: fixed`. Sandpack's CodeMirror editor is not touch-optimised.
- **LanguageRunner is isolated** — code run there has no access to the Sandpack virtual file system or any files in the project.
- **Preview device frames are cosmetic** — selecting "Mobile" in the preview toolbar constrains the iframe width but does not change the user agent string or touch event model inside the preview.

---

## Getting Started

```bash
# Install dependencies
npm install

# Add your MongoDB connection string
echo "MONGODB_URI=your_connection_string" > .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Built With

- [Next.js](https://nextjs.org/) — React framework and API routes
- [Sandpack](https://sandpack.codesandbox.io/) — in-browser bundler and editor
- [MongoDB](https://www.mongodb.com/) — project persistence
- [Tailwind CSS](https://tailwindcss.com/) — styling
