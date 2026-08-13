"use client"

import { Group, Panel, Separator as ResizeHandle } from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { FileTree } from "@/components/ide/file-explorer/file-tree"
import { EditorPanel } from "@/components/ide/editor-panel"
import { PreviewPanel } from "@/components/ide/preview-panel"
import { TerminalPanel } from "@/components/ide/terminal-panel"

const horizontalHandle =
  "w-px shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary/50 data-[active]:bg-primary/70"
const verticalHandle =
  "h-px shrink-0 cursor-row-resize bg-border transition-colors hover:bg-primary/50 data-[active]:bg-primary/70"

export function IdeShell() {
  return (
    <Group orientation="horizontal" className="h-full w-full">
      <Panel
        id="sidebar"
        defaultSize="18%"
        minSize="12%"
        maxSize="32%"
        className={cn("h-full w-full overflow-hidden border-r border-border")}
      >
        <FileTree />
      </Panel>

      <ResizeHandle className={horizontalHandle} />

      <Panel
        id="main"
        defaultSize="55%"
        minSize="30%"
        className="h-full w-full overflow-hidden"
      >
        <Group orientation="vertical" className="h-full w-full">
          <Panel
            id="editor"
            defaultSize="70%"
            minSize="20%"
            className="h-full w-full overflow-hidden"
          >
            <EditorPanel />
          </Panel>

          <ResizeHandle className={verticalHandle} />

          <Panel
            id="terminal"
            defaultSize="30%"
            minSize="10%"
            collapsible
            collapsedSize="0%"
            className="h-full w-full overflow-hidden border-t border-border"
          >
            <TerminalPanel />
          </Panel>
        </Group>
      </Panel>

      <ResizeHandle className={horizontalHandle} />

      <Panel
        id="preview"
        defaultSize="27%"
        minSize="15%"
        className="h-full w-full overflow-hidden border-l border-border"
      >
        <PreviewPanel />
      </Panel>
    </Group>
  )
}
