import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/* ============================================================
   VERSION CONSISTENCY GUARD (2026-07-25)

   Two independent ce:review personas flagged that NOTHING checked
   these files against each other — which is exactly how
   engine/package.json silently sat at 0.2.0 while the shipped
   plugin manifest said 0.3.0.

   Then it bit for real: the founder's `/plugin` update reported
     "Skipped — flowy-superpowers@flowy-core requires flowy-core at
      a version range that 0.4.0 does not satisfy"
   and the engine stayed on the OLD banner while a measurement was
   about to be taken against it.

   THE ROOT CAUSE WAS SEMVER, NOT SLOPPINESS. On a 0.x version a
   caret range is treated as breaking on every MINOR: ^0.2.0 means
   >=0.2.0 <0.3.0. So every engine release invalidated every overlay
   pin and the resolver refused to move. At thousands of overlays
   that strands the whole fleet on every release. Hence 1.0.0: from
   here, ^1.x accepts every engine minor/patch and only a genuine
   schema break (2.0.0) needs a coordinated release.

   These tests encode BOTH rules so neither can regress silently.
   ============================================================ */

const ROOT = join(import.meta.dir, "..", "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));

const enginePluginJson = read(join(ROOT, "engine", ".claude-plugin", "plugin.json"));
const enginePackageJson = read(join(ROOT, "engine", "package.json"));

const overlayDirs = readdirSync(join(ROOT, "overlays"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const overlays = overlayDirs.map((name) => ({
  name,
  manifest: read(join(ROOT, "overlays", name, ".claude-plugin", "plugin.json")),
}));

describe("version consistency across every manifest", () => {
  test("there are overlays to check (guards a broken glob)", () => {
    expect(overlays.length).toBeGreaterThan(0);
  });

  test("engine plugin.json and package.json agree", () => {
    // These drifted (0.2.0 vs 0.3.0) precisely because nothing compared them.
    expect(enginePackageJson.version).toBe(enginePluginJson.version);
  });

  test("every overlay ships the same version as the engine", () => {
    for (const o of overlays) {
      expect(`${o.name}@${o.manifest.version}`).toBe(`${o.name}@${enginePluginJson.version}`);
    }
  });

  test("every overlay's flowy-core dependency ACCEPTS the engine version", () => {
    // The check that would have caught the "0.4.0 does not satisfy" skip before
    // it reached the founder's machine.
    const [major] = enginePluginJson.version.split(".");
    for (const o of overlays) {
      const dep = (o.manifest.dependencies ?? []).find(
        (d: { name: string }) => d.name === "flowy-core",
      );
      expect(`${o.name}:${dep?.version}`).toBe(`${o.name}:^${major}.0.0`);
    }
  });

  test("the engine is >= 1.0.0 so caret pins survive a minor bump", () => {
    // THE structural lesson. On 0.x, ^0.N.0 excludes 0.(N+1).0, so every engine
    // release breaks every overlay pin and the plugin resolver silently skips
    // the update. Dropping back below 1.0.0 would reintroduce that deadlock for
    // the entire overlay fleet.
    const major = Number(enginePluginJson.version.split(".")[0]);
    expect(major).toBeGreaterThanOrEqual(1);
  });
});
