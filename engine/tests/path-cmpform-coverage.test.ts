/**
 * COVERAGE guard for FIX E: every path prefix-comparison in the hooks must
 * compare in ONE drive form.
 *
 * WHY THIS EXISTS. The drive-form defect (`C:/…` vs `/c/…` naming the same tree)
 * appeared at THREE independent sites across TWO files:
 *
 *   flowy-resolve.sh  S1 containment                 -> every overlay refused
 *   flowy-resolve.sh  FIX B canonical re-check       -> every overlay refused,
 *                                                       20 lines below the first
 *   flowy-inject.sh   the reinject restrict          -> the periodic routing
 *                                                       refresh silently dropped
 *
 * Fixing the first left the second broken with the first looking correct, and
 * the third was only reachable once the resolver worked at all. A report names
 * one instance; it is a sample, not the population.
 *
 * SCOPE OF THIS FILE, deliberately narrow: it asserts COVERAGE — that no NEW
 * comparison site appears without going through flowy_path_cmpform. It does NOT
 * assert behaviour; a source scan cannot see behaviour, and the three FIX E
 * cases in flowy-resolve.test.ts and flowy-inject.test.ts own that. Both halves
 * are needed: the behaviour tests would stay green if a fourth site were added
 * tomorrow, and this one would stay green if the helper were gutted.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOKS = join(fileURLToPath(new URL(".", import.meta.url)), "..", "hooks");
const HELPER = "flowy_path_cmpform";

/** `case "$A" in "$B"* )` — the prefix-containment idiom, whatever the case of
 *  the variable names. The first version of this scan was written as
 *  `case "\$_[a-z]*"` and MISSED the inject site because it uses `$COMPACT`;
 *  the narrow scan was the same class of error as the bug it hunts. */
const PREFIX_CMP = /case\s+"\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?"\s+in\s+"\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?"/g;

function stripComments(sh: string): string {
  return sh
    .split("\n")
    .map((l) => l.replace(/(^|\s)#.*$/, "$1"))
    .join("\n");
}

/** Every hook file's stripped source, keyed by filename. */
const sources = new Map<string, string>(
  readdirSync(HOOKS)
    .filter((f) => f.endsWith(".sh"))
    .map((f) => [f, stripComments(readFileSync(join(HOOKS, f), "utf8"))]),
);

/** Sites as `file:leftVar:rightVar`. */
function comparisonSites(): string[] {
  const out: string[] = [];
  for (const [file, src] of sources) {
    for (const m of src.matchAll(PREFIX_CMP)) out.push(`${file}:${m[1]}:${m[2]}`);
  }
  return out.sort();
}

/** True when `name` is assigned from a flowy_path_cmpform call in `src`. */
function assignedFromHelper(src: string, name: string): boolean {
  return new RegExp(`\\b${name}="\\$\\(\\s*${HELPER}\\b`).test(src);
}

describe("FIX E coverage — path comparisons normalize the drive form", () => {
  test("the scan finds the hook sources at all", () => {
    expect(sources.size).toBeGreaterThan(4);
    expect([...sources.keys()]).toContain("flowy-resolve.sh");
    expect([...sources.keys()]).toContain("flowy-inject.sh");
  });

  test("the scan can SEE a comparison (a regex that matches nothing passes everything)", () => {
    expect(comparisonSites().length).toBeGreaterThan(0);
  });

  test("⭐ BOTH sides of every path prefix-comparison come from flowy_path_cmpform", () => {
    const offenders: string[] = [];
    for (const site of comparisonSites()) {
      const [file, left, right] = site.split(":") as [string, string, string];
      const src = sources.get(file) as string;
      for (const v of [left, right]) {
        if (!assignedFromHelper(src, v)) offenders.push(`${file}: $${v} in a prefix compare, not normalized`);
      }
    }
    expect([...new Set(offenders)]).toEqual([]);
  });

  test("the helper is defined once, and normalizes for COMPARISON only", () => {
    const resolve = sources.get("flowy-resolve.sh") as string;
    expect((resolve.match(new RegExp(`^${HELPER}\\(\\)`, "gm")) ?? []).length).toBe(1);
    // A POSIX path cannot have ':' second, so the rewrite is a no-op off Windows.
    expect(resolve).toContain("[A-Za-z]:/*");
  });
});
