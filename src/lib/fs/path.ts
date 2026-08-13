import type { FsNode, NodeId } from "./types";

export function getNodePath(
  nodes: Record<NodeId, FsNode>,
  id: NodeId
): string {
  const segments: string[] = [];
  let current: FsNode | undefined = nodes[id];
  while (current) {
    segments.unshift(current.name);
    current = current.parentId ? nodes[current.parentId] : undefined;
  }
  return `/${segments.join("/")}`;
}
