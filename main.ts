// news-image-20261122 — "The World in One Page", Sunday 22 November 2026.
//
// The front page is rendered ahead of time (index.html -> entry.png) and this
// program only carries it into the grading sandbox. A plain copy keeps the
// output byte-identical across the two runs the grader performs, and the
// checks below enforce the competition's file rules before anything is
// written: the PNG magic bytes and the 1 MiB size cap.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1048576;

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const image = readFileSync(new URL("./entry.png", import.meta.url));

if (!image.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error("entry.png does not start with the PNG magic bytes");
}
if (image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes, over the ${MAX_BYTES} cap`);
}
// The IHDR chunk carries the pixel size right after its 8-byte length+type:
// width at bytes 16-19, height at bytes 20-23, both big-endian.
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), image);
