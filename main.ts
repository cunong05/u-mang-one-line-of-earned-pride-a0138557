// One Line of Earned Pride — entry: "After three failed harvests, the old farmer
// held up one perfect tomato and just stood there smiling at it."
// Node 22, stdlib only, no network.
// Writes exactly the entry (106 bytes, no trailing newline) to /output/entry.txt,
// then re-reads the file and verifies its sha256 before exiting.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

const ENTRY =
  "After three failed harvests, the old farmer held up one perfect tomato and just stood there smiling at it.";
const OUTPUT_PATH = "/output/entry.txt";
const EXPECTED_SHA256 =
  "a18047da31bb0a25a27f9c4e8bd458dcac046697cb96a5484030dad41e00fa18";

// Guard: one line, 1-240 characters, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 240) {
  throw new Error(`entry length must be 1-240 characters, got ${ENTRY.length}`);
}
if (!ENTRY.trim()) {
  throw new Error("entry must not be only whitespace");
}
if (/\n/.test(ENTRY)) {
  throw new Error("entry must be a single line");
}
// Guard: no leading or trailing whitespace (the entry is used verbatim).
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Gate: the written bytes must be exactly the entry, byte for byte.
const written = readFileSync(OUTPUT_PATH);
if (written.length !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error(
    `byte length mismatch for ${OUTPUT_PATH}: expected ${Buffer.byteLength(ENTRY, "utf8")}, got ${written.length}`,
  );
}
const actualSha256 = createHash("sha256").update(written).digest("hex");
if (actualSha256 !== EXPECTED_SHA256) {
  throw new Error(
    `sha256 mismatch for ${OUTPUT_PATH}: expected ${EXPECTED_SHA256}, got ${actualSha256}`,
  );
}
console.log(`wrote ${written.length} bytes to ${OUTPUT_PATH}`);
console.log(`sha256 verified: ${actualSha256}`);
