export type NodeId = string;

interface BaseNode {
  id: NodeId;
  name: string;
  parentId: NodeId | null;
}

export interface FileNode extends BaseNode {
  type: "file";
  content: string;
}

export interface FolderNode extends BaseNode {
  type: "folder";
  childIds: NodeId[];
}

export type FsNode = FileNode | FolderNode;

export function languageFromFileName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
}
