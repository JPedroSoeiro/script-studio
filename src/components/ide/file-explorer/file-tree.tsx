"use client"

import { useState } from "react"
import { FilePlusIcon, FolderPlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useFsStore } from "@/lib/stores/fs-store"
import type { NodeId } from "@/lib/fs/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileTreeItem } from "./file-tree-item"

type PromptState =
  | { kind: "create-file"; parentId: NodeId | null }
  | { kind: "create-folder"; parentId: NodeId | null }
  | { kind: "rename"; nodeId: NodeId }
  | null

export function FileTree() {
  const rootIds = useFsStore((state) => state.rootIds)
  const nodes = useFsStore((state) => state.nodes)
  const createFile = useFsStore((state) => state.createFile)
  const createFolder = useFsStore((state) => state.createFolder)
  const renameNode = useFsStore((state) => state.renameNode)

  const [prompt, setPrompt] = useState<PromptState>(null)
  const [name, setName] = useState("")

  function openCreateFile(parentId: NodeId | null) {
    setPrompt({ kind: "create-file", parentId })
    setName("")
  }

  function openCreateFolder(parentId: NodeId | null) {
    setPrompt({ kind: "create-folder", parentId })
    setName("")
  }

  function openRename(nodeId: NodeId) {
    setPrompt({ kind: "rename", nodeId })
    setName(nodes[nodeId]?.name ?? "")
  }

  function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed || !prompt) return

    if (prompt.kind === "create-file") {
      createFile(prompt.parentId, trimmed)
    } else if (prompt.kind === "create-folder") {
      createFolder(prompt.parentId, trimmed)
    } else {
      renameNode(prompt.nodeId, trimmed)
    }

    toast.success(
      prompt.kind === "rename" ? "Item renomeado" : "Item criado"
    )
    setPrompt(null)
  }

  const dialogTitle =
    prompt?.kind === "create-file"
      ? "Novo arquivo"
      : prompt?.kind === "create-folder"
        ? "Nova pasta"
        : "Renomear"

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          Explorador
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => openCreateFile(null)}
          >
            <FilePlusIcon />
            <span className="sr-only">Novo arquivo</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => openCreateFolder(null)}
          >
            <FolderPlusIcon />
            <span className="sr-only">Nova pasta</span>
          </Button>
        </div>
      </div>

      <ContextMenu>
        <ContextMenuTrigger
          render={<ScrollArea className="min-h-0 flex-1" />}
        >
          <div className="py-1">
            {rootIds.map((id) => (
              <FileTreeItem
                key={id}
                id={id}
                depth={0}
                onRequestCreateFile={openCreateFile}
                onRequestCreateFolder={openCreateFolder}
                onRequestRename={openRename}
              />
            ))}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => openCreateFile(null)}>
            <FilePlusIcon /> Novo arquivo
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openCreateFolder(null)}>
            <FolderPlusIcon /> Nova pasta
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog
        open={prompt !== null}
        onOpenChange={(open) => !open && setPrompt(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit()
            }}
            placeholder="nome-do-arquivo.tsx"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrompt(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
