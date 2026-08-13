"use client"

import { PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRuntimeStore } from "@/lib/stores/runtime-store"

export function TopBar() {
  const requestBuild = useRuntimeStore((state) => state.requestBuild)
  const building = useRuntimeStore((state) => state.building)

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Script Studio</span>
        <span className="text-xs text-muted-foreground">
          untitled-project
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={requestBuild} disabled={building}>
          <PlayIcon data-icon="inline-start" />
          Run
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <ThemeToggle />
      </div>
    </header>
  )
}
