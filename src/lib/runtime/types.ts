import type { FsNode, NodeId } from "@/lib/fs/types";

export interface BuildMessage {
  text: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface BuildResult {
  ok: boolean;
  js: string;
  css: string;
  errors: BuildMessage[];
  warnings: BuildMessage[];
  durationMs: number;
  outputBytes: number;
}

export interface RuntimeEngine {
  build(
    entryPath: string,
    nodes: Record<NodeId, FsNode>
  ): Promise<BuildResult>;
}
