import * as esbuild from "esbuild-wasm";

import type { FsNode, NodeId } from "@/lib/fs/types";
import { createVirtualFsPlugin } from "./virtual-fs-plugin";
import type { BuildMessage, BuildResult, RuntimeEngine } from "./types";

let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = esbuild.initialize({ wasmURL: "/esbuild.wasm" });
  }
  return initPromise;
}

function toBuildMessage(message: esbuild.Message): BuildMessage {
  return {
    text: message.text,
    file: message.location?.file?.replace(/^virtual-fs:/, ""),
    line: message.location?.line,
    column: message.location?.column,
  };
}

export const esbuildRuntime: RuntimeEngine = {
  async build(entryPath, nodes: Record<NodeId, FsNode>): Promise<BuildResult> {
    await ensureInitialized();
    const start = performance.now();

    try {
      const result = await esbuild.build({
        entryPoints: [entryPath],
        bundle: true,
        write: false,
        outdir: "/out",
        format: "esm",
        jsx: "automatic",
        sourcemap: "inline",
        logLevel: "silent",
        plugins: [createVirtualFsPlugin(nodes)],
      });

      const jsFile = result.outputFiles?.find((f) => f.path.endsWith(".js"));
      const cssFile = result.outputFiles?.find((f) => f.path.endsWith(".css"));

      return {
        ok: result.errors.length === 0,
        js: jsFile?.text ?? "",
        css: cssFile?.text ?? "",
        errors: result.errors.map(toBuildMessage),
        warnings: result.warnings.map(toBuildMessage),
        durationMs: performance.now() - start,
        outputBytes: (jsFile?.contents.byteLength ?? 0) + (cssFile?.contents.byteLength ?? 0),
      };
    } catch (err) {
      const failure = err as esbuild.BuildFailure;
      return {
        ok: false,
        js: "",
        css: "",
        errors: failure.errors?.length
          ? failure.errors.map(toBuildMessage)
          : [{ text: String(err) }],
        warnings: (failure.warnings ?? []).map(toBuildMessage),
        durationMs: performance.now() - start,
        outputBytes: 0,
      };
    }
  },
};
