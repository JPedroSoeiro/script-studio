import { getNodePath } from "@/lib/fs/path";
import type { FsNode, NodeId } from "@/lib/fs/types";

const ENTRY_CANDIDATES = [
  "/src/main.tsx",
  "/src/main.ts",
  "/src/index.tsx",
  "/src/index.ts",
  "/main.tsx",
  "/index.tsx",
];

export function findEntryPath(nodes: Record<NodeId, FsNode>): string | null {
  const paths = new Set(
    Object.keys(nodes)
      .filter((id) => nodes[id].type === "file")
      .map((id) => getNodePath(nodes, id))
  );
  return ENTRY_CANDIDATES.find((candidate) => paths.has(candidate)) ?? null;
}

const DEFAULT_DEPENDENCIES: Record<string, string> = {
  react: "^18.3.1",
  "react-dom": "^18.3.1",
};

export function getVirtualDependencies(
  nodes: Record<NodeId, FsNode>
): Record<string, string> {
  const packageJsonId = Object.keys(nodes).find(
    (id) => nodes[id].type === "file" && getNodePath(nodes, id) === "/package.json"
  );
  if (!packageJsonId) return DEFAULT_DEPENDENCIES;

  const node = nodes[packageJsonId];
  if (node.type !== "file") return DEFAULT_DEPENDENCIES;

  try {
    const parsed = JSON.parse(node.content) as {
      dependencies?: Record<string, string>;
    };
    return parsed.dependencies ?? DEFAULT_DEPENDENCIES;
  } catch {
    return DEFAULT_DEPENDENCIES;
  }
}
