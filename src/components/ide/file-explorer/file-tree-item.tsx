"use client"

import { useState } from "react"
import {
  ChevronRightIcon,
  FileIcon,
  FilePlusIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useFsStore } from "@/lib/stores/fs-store"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { NodeId } from "@/lib/fs/types"

interface FileTreeItemProps {
  id: NodeId
  depth: number
  onRequestCreateFile: (parentId: NodeId) => void
  onRequestCreateFolder: (parentId: NodeId) => void
  onRequestRename: (id: NodeId) => void
}

export function FileTreeItem({
  id,
  depth,
  onRequestCreateFile,
  onRequestCreateFolder,
  onRequestRename,
}: FileTreeItemProps) {
  const node = useFsStore((state) => state.nodes[id]);
  const activeFileId = useFsStore((state) => state.activeFileId);
  const setActiveFile = useFsStore((state) => state.setActiveFile);
  const deleteNode = useFsStore((state) => state.deleteNode);
  const [open, setOpen] = useState(true)

  if (!node) return null

  const indent = { paddingLeft: `${depth * 14 + 8}px` }

  function handleDelete() {
    if (!node) return
    const label = node.type === "folder" ? "a pasta" : "o arquivo"
    if (window.confirm(`Excluir ${label} "${node.name}"?`)) {
      deleteNode(id)
    }
  }

  if (node.type === "file") {
    return (
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <button
              type="button"
              style={indent}
              onClick={() => setActiveFile(id)}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-sm py-1 pr-2 text-left text-sm hover:bg-muted",
                activeFileId === id && "bg-accent text-accent-foreground"
              )}
            />
          }
        >
          <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onRequestRename(id)}>
            <PencilIcon /> Renomear
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2Icon /> Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <button
              type="button"
              style={indent}
              onClick={() => setOpen((v) => !v)}
              className="flex w-full items-center gap-1 rounded-sm py-1 pr-2 text-left text-sm hover:bg-muted"
            />
          }
        >
          <ChevronRightIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-90"
            )}
          />
          {open ? (
            <FolderOpenIcon className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate font-medium">{node.name}</span>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onRequestCreateFile(id)}>
            <FilePlusIcon /> Novo arquivo
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onRequestCreateFolder(id)}>
            <FolderPlusIcon /> Nova pasta
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => onRequestRename(id)}>
            <PencilIcon /> Renomear
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2Icon /> Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {open && (
        <div>
          {node.childIds.map((childId) => (
            <FileTreeItem
              key={childId}
              id={childId}
              depth={depth + 1}
              onRequestCreateFile={onRequestCreateFile}
              onRequestCreateFolder={onRequestCreateFolder}
              onRequestRename={onRequestRename}
            />
          ))}
        </div>
      )}
    </div>
  )
}
