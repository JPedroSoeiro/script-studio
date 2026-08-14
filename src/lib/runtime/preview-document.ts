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

  // srcdoc documents resolve relative hrefs against the parent page's URL,
  // not their own — so a plain "#section" link would navigate this iframe
  // to the outer app instead of scrolling in place. Intercept and handle
  // in-page hash links manually to keep navigation contained to the preview.
  document.addEventListener("click", (e) => {
    const anchor = e.target instanceof Element ? e.target.closest("a[href]") : null;
    const href = anchor?.getAttribute("href") || "";
    if (!href.startsWith("#") || href.length < 2) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
</script>
<script type="module">
${js}
</script>
</body>
</html>`;
}
