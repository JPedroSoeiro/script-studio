import type * as esbuild from "esbuild-wasm";

import type { FsNode, NodeId } from "@/lib/fs/types";
import { buildPathIndex, dirname, loaderForPath, resolveModulePath } from "./resolve";

const NAMESPACE = "virtual-fs";

export function createVirtualFsPlugin(
  nodes: Record<NodeId, FsNode>
): esbuild.Plugin {
  const pathIndex = buildPathIndex(nodes);

  return {
    name: NAMESPACE,
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === "entry-point") {
          return { path: args.path, namespace: NAMESPACE };
        }

        const isRelative =
          args.path.startsWith("./") || args.path.startsWith("../");
        const isAbsolute = args.path.startsWith("/");

        if (!isRelative && !isAbsolute) {
          // Bare specifier (e.g. "react"): resolved at runtime in the
          // preview iframe via an import map, not bundled here.
          return { path: args.path, external: true };
        }

        const fromDir = isAbsolute ? "/" : args.resolveDir || dirname(args.importer);
        const resolved = resolveModulePath(pathIndex, fromDir, args.path);

        if (!resolved) {
          return {
            errors: [
              {
                text: `Não foi possível resolver "${args.path}" a partir de "${args.importer || "entrada"}".`,
              },
            ],
          };
        }

        return { path: resolved, namespace: NAMESPACE };
      });

      build.onLoad({ filter: /.*/, namespace: NAMESPACE }, (args) => {
        const id = pathIndex.get(args.path);
        const node = id ? nodes[id] : undefined;

        if (!node || node.type !== "file") {
          return {
            errors: [{ text: `Arquivo não encontrado: ${args.path}` }],
          };
        }

        return {
          contents: node.content,
          loader: loaderForPath(args.path),
          resolveDir: dirname(args.path),
        };
      });
    },
  };
}
