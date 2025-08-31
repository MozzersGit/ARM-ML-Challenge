"use client";

import { CodeHighlightAdapterProvider, createShikiAdapter } from "@mantine/code-highlight";
import { ReactNode } from "react";

// Global constant mapping file suffix to { shiki: string, accept: string }
export const FILE_TYPE_MAP: Record<string, { shiki: string; accept: string }> = {
  js:   { shiki: "jsx",      accept: "text/javascript" },
  jsx:  { shiki: "jsx",      accept: "text/jsx" },
  ts:   { shiki: "tsx",      accept: "text/typescript" },
  tsx:  { shiki: "tsx",      accept: "text/tsx" },
  py:   { shiki: "python",   accept: "text/x-python" },
  java: { shiki: "java",     accept: "text/x-java-source" },
  rb:   { shiki: "ruby",     accept: "text/x-ruby" },
  go:   { shiki: "go",       accept: "text/x-go" },
  php:  { shiki: "php",      accept: "application/x-httpd-php" },
  css:  { shiki: "scss",     accept: "text/css" },
  scss: { shiki: "scss",     accept: "text/x-scss" },
  html: { shiki: "html",     accept: "text/html" },
  json: { shiki: "json",     accept: "application/json" },
  xml:  { shiki: "xml",      accept: "application/xml" },
  // fallback
  txt:  { shiki: "plaintext", accept: "text/plain" },
};

async function loadShiki() {
  const { createHighlighter } = await import("shiki");
  // Collect unique shiki language names from the FILE_TYPE_MAP
  const langs = Array.from(
    new Set(Object.values(FILE_TYPE_MAP).map((v) => v.shiki))
  );
  return createHighlighter({
    langs,
    themes: ["github-dark", "github-light"],
  });
}

const shikiAdapter = createShikiAdapter(loadShiki);

export function CodeHighlightProvider({ children }: { children: ReactNode }) {
  return (
    <CodeHighlightAdapterProvider adapter={shikiAdapter}>
      {children}
    </CodeHighlightAdapterProvider>
  );
}

export function getFileLanguage(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return FILE_TYPE_MAP[ext]?.shiki || "plaintext";
}