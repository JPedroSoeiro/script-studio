import type { BuildMessage } from "./types";

export function formatBuildMessage(message: BuildMessage): string {
  if (!message.file) return message.text;
  const location =
    message.line !== undefined
      ? `${message.file}:${message.line}${message.column !== undefined ? `:${message.column}` : ""}`
      : message.file;
  return `${location} — ${message.text}`;
}
