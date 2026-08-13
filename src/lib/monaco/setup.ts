import type { Monaco } from "@monaco-editor/react"

const EXTRA_LIBS = [
  ["/types/react/index.d.ts", "file:///node_modules/@types/react/index.d.ts"],
  ["/types/react/global.d.ts", "file:///node_modules/@types/react/global.d.ts"],
  [
    "/types/react/jsx-runtime.d.ts",
    "file:///node_modules/@types/react/jsx-runtime.d.ts",
  ],
  [
    "/types/react-dom/index.d.ts",
    "file:///node_modules/@types/react-dom/index.d.ts",
  ],
  [
    "/types/react-dom/client.d.ts",
    "file:///node_modules/@types/react-dom/client.d.ts",
  ],
  ["/types/csstype/index.d.ts", "file:///node_modules/csstype/index.d.ts"],
] as const

let configured = false

export async function configureMonaco(monaco: Monaco) {
  if (configured) return
  configured = true

  const { typescript, json } = monaco.languages
  const defaults = typescript.typescriptDefaults

  defaults.setCompilerOptions({
    target: typescript.ScriptTarget.ES2020,
    jsx: typescript.JsxEmit.ReactJSX,
    module: typescript.ModuleKind.ESNext,
    moduleResolution: typescript.ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    allowJs: true,
    allowNonTsExtensions: true,
    skipLibCheck: true,
    strict: true,
  })

  defaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })

  defaults.setEagerModelSync(true)

  json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: false,
  })

  await Promise.all(
    EXTRA_LIBS.map(async ([url, path]) => {
      const res = await fetch(url)
      const content = await res.text()
      defaults.addExtraLib(content, path)
    })
  )
}
