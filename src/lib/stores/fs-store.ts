import { create } from "zustand";

import {
  createDefaultProject,
  DEFAULT_ACTIVE_FILE_ID,
} from "@/lib/fs/default-project";
import type { FileNode, FolderNode, FsNode, NodeId } from "@/lib/fs/types";

function createId(prefix: "file" | "folder"): NodeId {
  return `${prefix}-${crypto.randomUUID()}`;
}

function collectDescendantIds(
  nodes: Record<NodeId, FsNode>,
  id: NodeId
): NodeId[] {
  const node = nodes[id];
  if (!node || node.type !== "folder") return [];
  const result: NodeId[] = [];
  for (const childId of node.childIds) {
    result.push(childId, ...collectDescendantIds(nodes, childId));
  }
  return result;
}

function isDescendant(
  nodes: Record<NodeId, FsNode>,
  ancestorId: NodeId,
  candidateId: NodeId | null
): boolean {
  let current = candidateId;
  while (current) {
    if (current === ancestorId) return true;
    current = nodes[current]?.parentId ?? null;
  }
  return false;
}

interface FsState {
  nodes: Record<NodeId, FsNode>;
  rootIds: NodeId[];
  activeFileId: NodeId | null;
  openFileIds: NodeId[];

  createFile: (parentId: NodeId | null, name: string) => NodeId;
  createFolder: (parentId: NodeId | null, name: string) => NodeId;
  renameNode: (id: NodeId, name: string) => void;
  deleteNode: (id: NodeId) => void;
  moveNode: (id: NodeId, newParentId: NodeId | null) => void;
  updateFileContent: (id: NodeId, content: string) => void;
  setActiveFile: (id: NodeId) => void;
  closeFile: (id: NodeId) => void;
}

const defaultProject = createDefaultProject();

export const useFsStore = create<FsState>((set) => ({
  nodes: defaultProject.nodes,
  rootIds: defaultProject.rootIds,
  activeFileId: DEFAULT_ACTIVE_FILE_ID,
  openFileIds: [DEFAULT_ACTIVE_FILE_ID],

  createFile(parentId, name) {
    const id = createId("file");
    const node: FileNode = { id, type: "file", name, parentId, content: "" };

    set((state) => {
      const nodes = { ...state.nodes, [id]: node };
      if (parentId) {
        const parent = nodes[parentId] as FolderNode;
        nodes[parentId] = { ...parent, childIds: [...parent.childIds, id] };
      }
      return {
        nodes,
        rootIds: parentId ? state.rootIds : [...state.rootIds, id],
        activeFileId: id,
        openFileIds: state.openFileIds.includes(id)
          ? state.openFileIds
          : [...state.openFileIds, id],
      };
    });

    return id;
  },

  createFolder(parentId, name) {
    const id = createId("folder");
    const node: FolderNode = {
      id,
      type: "folder",
      name,
      parentId,
      childIds: [],
    };

    set((state) => {
      const nodes = { ...state.nodes, [id]: node };
      if (parentId) {
        const parent = nodes[parentId] as FolderNode;
        nodes[parentId] = { ...parent, childIds: [...parent.childIds, id] };
      }
      return {
        nodes,
        rootIds: parentId ? state.rootIds : [...state.rootIds, id],
      };
    });

    return id;
  },

  renameNode(id, name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => {
      const node = state.nodes[id];
      if (!node) return state;
      return { nodes: { ...state.nodes, [id]: { ...node, name: trimmed } } };
    });
  },

  deleteNode(id) {
    set((state) => {
      const node = state.nodes[id];
      if (!node) return state;

      const toRemove = new Set([id, ...collectDescendantIds(state.nodes, id)]);
      const nodes = { ...state.nodes };
      for (const removedId of toRemove) delete nodes[removedId];

      if (node.parentId) {
        const parent = nodes[node.parentId] as FolderNode;
        nodes[node.parentId] = {
          ...parent,
          childIds: parent.childIds.filter((cid) => cid !== id),
        };
      }

      const rootIds = state.rootIds.filter((rid) => rid !== id);
      const openFileIds = state.openFileIds.filter(
        (fid) => !toRemove.has(fid)
      );
      const activeFileId = toRemove.has(state.activeFileId ?? "")
        ? (openFileIds[openFileIds.length - 1] ?? null)
        : state.activeFileId;

      return { nodes, rootIds, openFileIds, activeFileId };
    });
  },

  moveNode(id, newParentId) {
    if (id === newParentId) return;
    set((state) => {
      const node = state.nodes[id];
      if (!node) return state;
      if (isDescendant(state.nodes, id, newParentId)) return state;

      const nodes = { ...state.nodes };
      const oldParentId = node.parentId;

      if (oldParentId) {
        const oldParent = nodes[oldParentId] as FolderNode;
        nodes[oldParentId] = {
          ...oldParent,
          childIds: oldParent.childIds.filter((cid) => cid !== id),
        };
      }
      if (newParentId) {
        const newParent = nodes[newParentId] as FolderNode;
        nodes[newParentId] = {
          ...newParent,
          childIds: [...newParent.childIds, id],
        };
      }
      nodes[id] = { ...node, parentId: newParentId } as FsNode;

      const rootIds = oldParentId
        ? state.rootIds
        : state.rootIds.filter((rid) => rid !== id);

      return {
        nodes,
        rootIds: newParentId ? rootIds : [...rootIds, id],
      };
    });
  },

  updateFileContent(id, content) {
    set((state) => {
      const node = state.nodes[id];
      if (!node || node.type !== "file") return state;
      return { nodes: { ...state.nodes, [id]: { ...node, content } } };
    });
  },

  setActiveFile(id) {
    set((state) => ({
      activeFileId: id,
      openFileIds: state.openFileIds.includes(id)
        ? state.openFileIds
        : [...state.openFileIds, id],
    }));
  },

  closeFile(id) {
    set((state) => {
      const openFileIds = state.openFileIds.filter((fid) => fid !== id);
      const activeFileId =
        state.activeFileId === id
          ? (openFileIds[openFileIds.length - 1] ?? null)
          : state.activeFileId;
      return { openFileIds, activeFileId };
    });
  },
}));

export function useNode(id: NodeId | null) {
  return useFsStore((state) => (id ? state.nodes[id] : undefined));
}
