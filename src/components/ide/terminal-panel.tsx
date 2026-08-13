"use client"

import { useEffect, useRef } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { useTheme } from "next-themes"
import "@xterm/xterm/css/xterm.css"

import { useRuntimeStore, type LogEntry } from "@/lib/stores/runtime-store"

const COLORS: Record<LogEntry["kind"], string> = {
  info: "\x1b[90m",
  warning: "\x1b[33m",
  error: "\x1b[31m",
}
const RESET = "\x1b[0m"
const PROMPT = "\x1b[32m$\x1b[0m "

const DARK_THEME = { background: "#0a0a0a", foreground: "#ededed" }
const LIGHT_THEME = { background: "#ffffff", foreground: "#171717" }

export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const writtenCountRef = useRef(0)
  const lineBufferRef = useRef("")
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const term = new Terminal({
      convertEol: true,
      fontSize: 12,
      cursorBlink: true,
      theme: resolvedTheme === "light" ? LIGHT_THEME : DARK_THEME,
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(containerRef.current)
    fitAddon.fit()
    termRef.current = term

    term.writeln("Script Studio — logs de build em tempo real.")

    function flushNewLogs() {
      const logs = useRuntimeStore.getState().logs
      const newEntries = logs.slice(writtenCountRef.current)
      writtenCountRef.current = logs.length
      for (const entry of newEntries) {
        term.writeln(`${COLORS[entry.kind]}${entry.text}${RESET}`)
      }
      if (newEntries.length > 0) {
        term.write(PROMPT + lineBufferRef.current)
      }
    }

    term.write(PROMPT)
    flushNewLogs()

    function handleData(data: string) {
      for (const char of data) {
        if (char === "\r") {
          const command = lineBufferRef.current.trim()
          lineBufferRef.current = ""
          term.write("\r\n")
          if (command === "clear") {
            term.clear()
          } else if (command.length > 0) {
            term.writeln(
              `comando "${command}" indisponível — um shell real requer o motor WebContainers (em breve).`
            )
          }
          term.write(PROMPT)
        } else if (char === "") {
          if (lineBufferRef.current.length > 0) {
            lineBufferRef.current = lineBufferRef.current.slice(0, -1)
            term.write("\b \b")
          }
        } else if (char >= " ") {
          lineBufferRef.current += char
          term.write(char)
        }
      }
    }

    const dataDisposable = term.onData(handleData)
    const unsubscribe = useRuntimeStore.subscribe(() => {
      term.write("\r\n")
      flushNewLogs()
    })

    const resizeObserver = new ResizeObserver(() => fitAddon.fit())
    resizeObserver.observe(containerRef.current)

    return () => {
      dataDisposable.dispose()
      unsubscribe()
      resizeObserver.disconnect()
      term.dispose()
      termRef.current = null
    }
    // Terminal is created once; theme updates are applied via the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!termRef.current) return
    termRef.current.options.theme =
      resolvedTheme === "light" ? LIGHT_THEME : DARK_THEME
  }, [resolvedTheme])

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden px-2 py-1"
    />
  )
}
