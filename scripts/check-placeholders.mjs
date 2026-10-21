#!/usr/bin/env node
// Lists every TODO_ placeholder token in src/. On a Vercel production build (VERCEL_ENV=production),
// any token fails the build. Everywhere else it prints a warning list and lets the build continue.
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const TOKEN = /\bTODO_[A-Z0-9_]+/g;
const EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|css|md|json|svg|txt)$/;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.test(entry.name)) yield path;
  }
}

const hits = [];
for await (const file of walk(SRC)) {
  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const match of line.matchAll(TOKEN)) hits.push({ file: relative(ROOT, file), line: i + 1, token: match[0] });
  });
}

const isProduction = process.env.VERCEL_ENV === "production";

if (hits.length === 0) {
  console.log("check-placeholders: no TODO_ placeholders in src/.");
  process.exit(0);
}

const list = hits.map((h) => `  ${h.file}:${h.line}  ${h.token}`).join("\n");
if (isProduction) {
  console.error(`check-placeholders: ${hits.length} placeholder(s) left. Production build blocked:\n${list}`);
  process.exit(1);
}
console.warn(`check-placeholders: ${hits.length} placeholder(s) left (allowed outside production):\n${list}`);
