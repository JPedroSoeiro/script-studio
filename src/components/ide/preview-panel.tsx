"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useFsStore } from "@/lib/stores/fs-store"
import { useRuntimeStore } from "@/lib/stores/runtime-store"
import { esbuildRuntime } from "@/lib/runtime/esbuild-runtime"
import { findEntryPath, getVirtualDependencies } from "@/lib/runtime/entry"
import { buildPreviewDocument } from "@/lib/runtime/preview-document"
import { formatBuildMessage } from "@/lib/runtime/format"

const EMPTY_DOC = buildPreviewDocument({
  js: "",
  css: "body { font-family: sans-serif; color: #888; }",
  dependencies: {},
})

export function PreviewPanel() {
  const nodes = useFsStore((state) => state.nodes)
  const setBuilding = useRuntimeStore((state) => state.setBuilding)
  const appendLog = useRuntimeStore((state) => state.appendLog)
  const requestId = useRuntimeStore((state) => state.requestId)

  const [srcDoc, setSrcDoc] = useState(EMPTY_DOC)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRequest = useRef(true)

  const runBuild = useCallback(async () => {
    const entry = findEntryPath(nodes)
    if (!entry) {
      appendLog(
        "error",
        "Nenhum ponto de entrada encontrado (esperado src/main.tsx)."
      )
      return
    }

    setBuilding(true)
    appendLog("info", "Build iniciado…")
    const result = await esbuildRuntime.build(entry, nodes)
    setBuilding(false)

    for (const warning of result.warnings) {
      appendLog("warning", formatBuildMessage(warning))
    }

    if (result.ok) {
      const dependencies = getVirtualDependencies(nodes)
      setSrcDoc(
        buildPreviewDocument({ js: result.js, css: result.css, dependencies })
      )
      appendLog(
        "info",
        `Build concluído em ${Math.round(result.durationMs)}ms (${(result.outputBytes / 1024).toFixed(1)} kB)`
      )
    } else {
      for (const error of result.errors) {
        appendLog("error", formatBuildMessage(error))
      }
    }
  }, [nodes, setBuilding, appendLog])

  // Debounced auto-rebuild whenever the virtual FS changes.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(runBuild, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [nodes, runBuild])

  // Immediate rebuild when the "Run" button is clicked.
  useEffect(() => {
    if (isFirstRequest.current) {
      isFirstRequest.current = false
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    void runBuild()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.source === "script-studio-preview" && event.data.kind === "error") {
        appendLog("error", String(event.data.text))
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [appendLog])

  return (
    <iframe
      title="Preview"
      className="h-full w-full border-0 bg-white"
      sandbox="allow-scripts allow-same-origin"
      srcDoc={srcDoc}
    />
  )
}
