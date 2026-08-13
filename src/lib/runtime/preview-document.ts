function buildImportMap(dependencies: Record<string, string>): string {
  const imports: Record<string, string> = {};
  for (const [name, versionRange] of Object.entries(dependencies)) {
    const version = versionRange.replace(/^[^\d]*/, "") || "latest";
    imports[name] = `https://esm.sh/${name}@${version}`;
    imports[`${name}/`] = `https://esm.sh/${name}@${version}/`;
  }
  return JSON.stringify({ imports });
}

interface BuildPreviewDocumentArgs {
  js: string;
  css: string;
  dependencies: Record<string, string>;
}

export function buildPreviewDocument({
  js,
  css,
  dependencies,
}: BuildPreviewDocumentArgs): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>${css}</style>
<script type="importmap">${buildImportMap(dependencies)}</script>
</head>
<body>
<div id="root"></div>
<script>
  function report(text) {
    window.parent.postMessage({ source: "script-studio-preview", kind: "error", text }, "*");
  }
  window.addEventListener("error", (e) => report(String(e.error?.stack || e.message)));
  window.addEventListener("unhandledrejection", (e) => report(String(e.reason?.stack || e.reason)));
</script>
<script type="module">
${js}
</script>
</body>
</html>`;
}
