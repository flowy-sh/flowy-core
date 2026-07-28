#!/usr/bin/env node
/**
 * flowy-provenance: is this our routing, and can I show why?
 *
 *   node engine/tools/flowy-provenance.mjs generate
 *       Rebuild engine/provenance/manifest.json from the shipped Flows.
 *       Commit the result. Git supplies the timestamp that makes it evidence.
 *
 *   node engine/tools/flowy-provenance.mjs check <file-or-dir>...
 *       Compare suspect files against every canonical Flow and print the
 *       evidence. Exit 0 when nothing matches, 1 when something does, so it
 *       can run in CI over a competitor's public repo if it ever comes to that.
 *
 * It prints evidence, not accusations. Every number is reproducible by anyone
 * with both files, which is the only reason a report like this is worth
 * attaching to an email.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { compareToCanonical } from "./provenance-core.mjs";
import { buildManifest } from "./provenance-manifest.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const MANIFEST_DIR = join(ROOT, "engine", "provenance");
const MANIFEST_PATH = join(MANIFEST_DIR, "manifest.json");

const TEXT_EXT = /\.(md|markdown|txt|json|ya?ml)$/i;
const SKIP_DIR = /^(\.git|node_modules|dist|build|\.next)$/;

function walk(target) {
  const stat = statSync(target);
  if (!stat.isDirectory()) return [target];

  const out = [];
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIR.test(entry.name)) continue;
      out.push(...walk(join(target, entry.name)));
    } else if (TEXT_EXT.test(entry.name)) {
      out.push(join(target, entry.name));
    }
  }
  return out;
}

function generate() {
  const manifest = buildManifest(ROOT);
  mkdirSync(MANIFEST_DIR, { recursive: true });
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`wrote ${relative(ROOT, MANIFEST_PATH)}`);
  for (const flow of manifest.flows) {
    console.log(
      `  ${flow.id.padEnd(18)} ${flow.routes.length} routes, ` +
        `${flow.canaries.length} canaries, sha256 ${flow.hash.slice(0, 12)}`,
    );
  }
  return 0;
}

const pct = (n) => `${Math.round(n * 100)}%`;

function reportFor(file, manifest) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (err) {
    console.log(`SKIP  ${file}  (${err.code ?? "unreadable"})`);
    return false;
  }

  let hit = false;

  for (const flow of manifest.flows) {
    const r = compareToCanonical(flow, text);
    if (r.verdict === "no-match") continue;
    hit = true;

    console.log("");
    console.log(`${r.verdict.toUpperCase()}  ${file}`);
    console.log(`  against : ${flow.id} (${flow.path})`);

    if (r.exact) {
      console.log(`  evidence: byte-identical after newline normalization`);
      console.log(`            sha256 ${flow.hash}`);
    } else {
      console.log(
        `  evidence: ${r.matchedRoutes.length}/${r.canonicalRouteCount} of our routes present ` +
          `(${pct(r.routeContainment)} containment)`,
      );
      console.log(`            ${pct(r.orderScore)} of the shared routes keep our ordering`);
      if (r.canaryHits.length) {
        console.log(`            ${r.canaryHits.length} canary string(s) carried verbatim:`);
        for (const c of r.canaryHits) console.log(`              "${c}"`);
      }
      if (r.matchedRoutes.length) {
        console.log(`  routes  : ${r.matchedRoutes.slice(0, 8).join(", ")}`);
        if (r.matchedRoutes.length > 8) {
          console.log(`            ...and ${r.matchedRoutes.length - 8} more`);
        }
      }
    }
  }

  return hit;
}

function check(targets) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    console.error(`no manifest at ${relative(ROOT, MANIFEST_PATH)}. Run: generate`);
    return 2;
  }

  const files = targets.flatMap((t) => {
    try {
      return walk(t);
    } catch (err) {
      console.error(`cannot read ${t}: ${err.code ?? err.message}`);
      return [];
    }
  });

  if (files.length === 0) {
    console.error("no readable files in the given targets");
    return 2;
  }

  let anyHit = false;
  for (const f of files) anyHit = reportFor(f, manifest) || anyHit;

  console.log("");
  if (!anyHit) {
    console.log(`checked ${files.length} file(s). No match against any Flowy Flow.`);
    return 0;
  }

  console.log(`checked ${files.length} file(s). See ATTRIBUTION.md for what a match obliges.`);
  console.log("Read the evidence before acting on it. Start with an email, not a lawyer.");
  return 1;
}

const [command, ...rest] = process.argv.slice(2);

if (command === "generate") {
  process.exit(generate());
} else if (command === "check" && rest.length > 0) {
  process.exit(check(rest));
} else {
  console.error("usage: flowy-provenance generate");
  console.error("       flowy-provenance check <file-or-dir>...");
  process.exit(2);
}
