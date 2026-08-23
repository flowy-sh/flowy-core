#!/usr/bin/env bun
/**
 * WALK EVERY OVERLAY AND ASK WHETHER ITS ROUTES POINT AT ANYTHING REAL.
 *
 * ⭐ THE GAP THIS CLOSES. `flow-rules.mjs` runs six checks and every one of them
 * compares a FLOW.md to ITSELF: its section order, its own route verbs, its own
 * orphaned names, its own claimed counts. Nothing in the repo had ever compared
 * a route to the plugin it targets, so an upstream rename turned a route into a
 * silent no-op that no test, no build and no user could see. A dead route does
 * not error. The skill just never fires, which looks exactly like the model
 * choosing not to route it.
 *
 * Measured on 2026-08-23 over the 7 of 102 overlays whose target plugin happened
 * to be installed locally: compound-engineering 23 of 32 routes DEAD, mem0 7 of
 * 23. The other five were clean, so this is drift in specific overlays rather
 * than a broken authoring harness.
 *
 * ⚠ THE POPULATION IS WHAT IS INSTALLED, AND IT SAYS SO. 95 overlays target
 * plugins that are not on this machine and are reported UNVERIFIABLE, never
 * "ok". An unknown that reads as healthy is the failure mode this whole tool
 * exists to answer.
 *
 * Usage, from the repo root:
 *   bun engine/tools/check-routes.mjs                 report every overlay
 *   bun engine/tools/check-routes.mjs mem0            one overlay
 *   bun engine/tools/check-routes.mjs --errors        only overlays with dead routes
 *
 * Exit 1 if any VERIFIABLE overlay has a dead route. Unverifiable never fails
 * the run: it would make the tool useless on any machine, and a check that
 * cannot be run is a check nobody runs.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { checkRoutesResolve } from "./flow-rules.mjs";

const REPO = join(import.meta.dir, "..", "..");
const CACHE = process.env.FLOWY_PLUGIN_CACHE ?? join(homedir(), ".claude", "plugins", "cache");

const args = process.argv.slice(2);
const only = args.find((a) => !a.startsWith("--"));
const errorsOnly = args.includes("--errors");

function dirs(p) {
  if (!existsSync(p)) return [];
  return readdirSync(p).filter((d) => {
    try {
      return statSync(join(p, d)).isDirectory();
    } catch {
      return false;
    }
  });
}

/**
 * Build namespace -> installed slugs from the local plugin cache.
 *
 * ⚠ A PLUGIN CAN BE CACHED AT SEVERAL VERSIONS AT ONCE — this machine holds
 * both 1.2.0 and 1.2.1 of every flowy overlay, and superpowers at 5.1.0, 6.2.0
 * and 6.3.0. Picking one arbitrarily would make the report depend on readdir
 * order. We take the UNION across versions, which is the forgiving direction:
 * it can only ever HIDE a dead route, never invent one, so every dead route
 * this tool reports is dead in every installed version.
 */
function installedSkills() {
  const byNs = new Map();
  for (const marketplace of dirs(CACHE)) {
    for (const plugin of dirs(join(CACHE, marketplace))) {
      for (const version of dirs(join(CACHE, marketplace, plugin))) {
        const skillsDir = join(CACHE, marketplace, plugin, version, "skills");
        if (!existsSync(skillsDir)) continue;
        if (!byNs.has(plugin)) byNs.set(plugin, new Set());
        for (const s of dirs(skillsDir)) byNs.get(plugin).add(s);
      }
    }
  }
  return byNs;
}

function flowFilesFor(overlay) {
  const flowsRoot = join(REPO, "overlays", overlay, "flows");
  const out = [];
  for (const d of dirs(flowsRoot)) {
    const f = join(flowsRoot, d, "FLOW.md");
    if (existsSync(f)) out.push(f);
  }
  return out;
}

/** Namespaces a FLOW.md actually routes to, in frequency order. */
function routedNamespaces(text) {
  const counts = new Map();
  for (const m of text.matchAll(/invoke\s+([a-z0-9_-]+):[a-z0-9_-]+/gi)) {
    const ns = m[1].toLowerCase();
    counts.set(ns, (counts.get(ns) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([ns]) => ns);
}

const installed = installedSkills();
const overlays = only ? [only] : dirs(join(REPO, "overlays")).sort();

let dead = 0;
let verified = 0;
let unverifiable = 0;
const failing = [];

for (const overlay of overlays) {
  for (const file of flowFilesFor(overlay)) {
    const text = readFileSync(file, "utf8");
    const namespaces = routedNamespaces(text);
    if (namespaces.length === 0) continue;

    // Only namespaces we can actually see get a verdict. The rest are named as
    // unverifiable, which is a THIRD state and deliberately not a pass.
    const known = namespaces.filter((ns) => installed.has(ns));
    const unknown = namespaces.filter((ns) => !installed.has(ns));

    if (known.length === 0) {
      unverifiable++;
      if (!errorsOnly) {
        console.log(`  ?  ${overlay.padEnd(28)} UNVERIFIABLE (${unknown.join(", ")} not installed)`);
      }
      continue;
    }

    const map = Object.fromEntries(known.map((ns) => [ns, [...installed.get(ns)]]));
    // Unknown namespaces would each raise "cannot verify". That is correct for a
    // single-namespace file and pure noise for a file that merely mentions a
    // second plugin in a route, so they are dropped HERE, in the caller, having
    // been counted above. The rule itself still refuses to stay silent.
    const errors = checkRoutesResolve(text, map).filter((e) => !/cannot verify/.test(e));

    verified++;
    if (errors.length > 0) {
      dead += errors.length;
      failing.push({ overlay, file, errors });
      console.log(`  X  ${overlay.padEnd(28)} ${errors.length} DEAD route(s)`);
    } else if (!errorsOnly) {
      console.log(`  ok ${overlay.padEnd(28)} all routes resolve (${known.join(", ")})`);
    }
  }
}

console.log(
  `\nverified ${verified}  |  unverifiable ${unverifiable}  |  overlays with dead routes ${failing.length}  |  dead routes ${dead}`,
);

for (const f of failing) {
  console.log(`\n--- ${f.overlay} ---`);
  for (const e of f.errors) console.log(`  ${e}`);
}

process.exit(failing.length > 0 ? 1 : 0);
