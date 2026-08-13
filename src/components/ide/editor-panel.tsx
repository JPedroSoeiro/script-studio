"use client"

import { useCallback, useRef } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"

import { useFsStore } from "@/lib/stores/fs-store"
import { languageFromFileName } from "@/lib/fs/types"
import { getNodePath } from "@/lib/fs/path"
import { configureMonaco } from "@/lib/monaco/setup"
import { EditorTabs } from "@/components/ide/editor-tabs"

export function EditorPanel() {
  const activeFileId = useFsStore((state) => state.activeFileId)
  const nodes = useFsStore((state) => state.nodes)
  const updateFileContent = useFsStore((state) => state.updateFileContent)
  const { resolvedTheme } = useTheme()

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (!activeFileId || value === undefined) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        updateFileContent(activeFileId, value)
      }, 300)
    },
    [activeFileId, updateFileContent]
  )

  const handleMount: OnMount = (_editor, monaco) => {
    void configureMonaco(monaco)
  }

  const activeNode = activeFileId ? nodes[activeFileId] : undefined

  if (!activeNode || activeNode.type !== "file") {
    return (
      <div className="flex h-full w-full flex-col">
        <EditorTabs />
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Selecione um arquivo para editar
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      <EditorTabs />
      <div className="min-h-0 flex-1">
        <Editor
          path={getNodePath(nodes, activeNode.id)}
          defaultLanguage={languageFromFileName(activeNode.name)}
          language={languageFromFileName(activeNode.name)}
          value={activeNode.content}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          onChange={handleChange}
          onMount={handleMount}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            automaticLayout: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  )
}
