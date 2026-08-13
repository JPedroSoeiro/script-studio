"use client"

import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useFsStore } from "@/lib/stores/fs-store"

export function EditorTabs() {
  const openFileIds = useFsStore((state) => state.openFileIds)
  const activeFileId = useFsStore((state) => state.activeFileId)
  const nodes = useFsStore((state) => state.nodes)
  const setActiveFile = useFsStore((state) => state.setActiveFile)
  const closeFile = useFsStore((state) => state.closeFile)

  if (openFileIds.length === 0) return null

  return (
    <div className="flex h-8 shrink-0 items-center overflow-x-auto border-b border-border">
      {openFileIds.map((id) => {
        const node = nodes[id]
        if (!node) return null
        const isActive = id === activeFileId
        return (
          <div
            key={id}
            onClick={() => setActiveFile(id)}
            className={cn(
              "group flex h-full shrink-0 cursor-pointer items-center gap-1.5 border-r border-border px-3 text-sm",
              isActive
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="truncate">{node.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                closeFile(id)
              }}
              className="rounded-sm p-0.5 opacity-0 hover:bg-accent group-hover:opacity-100"
            >
              <XIcon className="size-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
