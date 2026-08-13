import type { FsNode, NodeId } from "./types";

const APP_TSX = `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "4rem" }}>
      <h1>Script Studio</h1>
      <p>Edite src/App.tsx e veja o preview atualizar.</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Cliques: {count}
      </button>
    </div>
  );
}
`;

const MAIN_TSX = `import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
`;

const STYLES_CSS = `body {
  margin: 0;
  background: #ffffff;
  color: #111111;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
`;

const PACKAGE_JSON = `{
  "name": "sandbox-project",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
`;

export interface DefaultProject {
  nodes: Record<NodeId, FsNode>;
  rootIds: NodeId[];
}

export function createDefaultProject(): DefaultProject {
  const srcId = "folder-src";
  const appId = "file-app";
  const mainId = "file-main";
  const stylesId = "file-styles";
  const packageJsonId = "file-package-json";

  const nodes: Record<NodeId, FsNode> = {
    [srcId]: {
      id: srcId,
      type: "folder",
      name: "src",
      parentId: null,
      childIds: [appId, mainId, stylesId],
    },
    [appId]: {
      id: appId,
      type: "file",
      name: "App.tsx",
      parentId: srcId,
      content: APP_TSX,
    },
    [mainId]: {
      id: mainId,
      type: "file",
      name: "main.tsx",
      parentId: srcId,
      content: MAIN_TSX,
    },
    [stylesId]: {
      id: stylesId,
      type: "file",
      name: "styles.css",
      parentId: srcId,
      content: STYLES_CSS,
    },
    [packageJsonId]: {
      id: packageJsonId,
      type: "file",
      name: "package.json",
      parentId: null,
      content: PACKAGE_JSON,
    },
  };

  return {
    nodes,
    rootIds: [srcId, packageJsonId],
  };
}

export const DEFAULT_ACTIVE_FILE_ID = "file-app";
