import { getNodePath } from "@/lib/fs/path";
import type { FsNode, NodeId } from "@/lib/fs/types";

const RESOLVABLE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];

export function buildPathIndex(
  nodes: Record<NodeId, FsNode>
): Map<string, NodeId> {
  const index = new Map<string, NodeId>();
  for (const id of Object.keys(nodes)) {
    if (nodes[id].type === "file") {
      index.set(getNodePath(nodes, id), id);
    }
  }
  return index;
}

function normalizePath(path: string): string {
  const stack: string[] = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return `/${stack.join("/")}`;
}

export function dirname(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "/" : path.slice(0, idx);
}

export function joinPath(dir: string, request: string): string {
  if (request.startsWith("/")) return normalizePath(request);
  return normalizePath(`${dir}/${request}`);
}

/**
 * Resolves a relative or absolute import against the virtual FS, trying
 * common extensions and directory `index` files (mirrors Node resolution).
 */
export function resolveModulePath(
  pathIndex: Map<string, NodeId>,
  fromDir: string,
  request: string
): string | null {
  const base = joinPath(fromDir, request);
  if (pathIndex.has(base)) return base;

  for (const ext of RESOLVABLE_EXTENSIONS) {
    if (pathIndex.has(base + ext)) return base + ext;
  }
  for (const ext of RESOLVABLE_EXTENSIONS) {
    const indexPath = `${base}/index${ext}`;
    if (pathIndex.has(indexPath)) return indexPath;
  }
  return null;
}

export function loaderForPath(
  path: string
): "tsx" | "ts" | "jsx" | "js" | "css" | "json" | "text" {
  switch (path.split(".").pop()) {
    case "tsx":
      return "tsx";
    case "ts":
      return "ts";
    case "jsx":
      return "jsx";
    case "js":
    case "mjs":
    case "cjs":
      return "js";
    case "css":
      return "css";
    case "json":
      return "json";
    default:
      return "text";
  }
}
