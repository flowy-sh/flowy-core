/**
 * Which license covers which file.
 *
 * NOTICE states the rule in one line:
 *
 *     ROUTING CONTENT is CC BY-SA 4.0.
 *     EVERYTHING THAT EXECUTES is Apache-2.0.
 *
 * This module is the executable form of that sentence, so the split cannot
 * drift away from the file that promises it. engine/tests/license-coverage.test.ts
 * walks `git ls-files` through it and fails if any tracked file is unassigned.
 *
 * ALLOWLIST, NOT CATCH-ALL (A6, 2026-07-28). This function used to end in
 * `return "Apache-2.0"`, which made `=== null` unreachable and the coverage
 * guard incapable of failing on any input at all. Measured with that catch-all
 * in place: a root `THIRD-PARTY-LICENSE.txt` was stamped Apache-2.0, claiming
 * our license over somebody else's verbatim legal text, and
 * `overlays/superpowers/flows/superpowers/bin/run.sh` was stamped CC-BY-SA-4.0,
 * putting share-alike on an executable. The suite stayed 8 pass / 0 fail.
 *
 * So: recognise a path or return null. An unrecognised path is a DECISION
 * somebody has to make, and the guard's job is to stop and ask rather than to
 * guess. Adding a new top-level file is expected to fail this test once.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export const LICENSE_BUCKETS = ["CC-BY-SA-4.0", "Apache-2.0", "license-text"];

/** Verbatim third-party legal texts. We did not write them and do not license them. */
const LICENSE_TEXTS = new Set(["LICENSE", "LICENSE-CODE"]);

/** Prose. A file that executes or configures execution never matches this. */
const CONTENT_EXT = /\.(md|markdown)$/i;

/** Directories whose files execute, or configure something that executes. */
const EXECUTING = /^(engine|overlays|\.claude-plugin|\.github)\//;

/**
 * Root-level project metadata, enumerated on purpose. Anything not listed here
 * is UNCLASSIFIED, so a genuinely new top-level path fails the coverage guard
 * and forces a decision instead of silently defaulting into Apache-2.0.
 */
const KNOWN_META = new Set([
  ".gitattributes",
  ".gitignore",
  "NOTICE",
  "ATTRIBUTION.md",
  "PROVENANCE.md",
]);

/**
 * Routing content: the selection, ordering, and wording of the routes. This is
 * the work share-alike is meant to protect.
 *
 * Scoped to `overlays/<name>/flows/...` and to the scaffold template. A FLOW.md
 * living anywhere else (an engine test fixture, say) is not shipped routing and
 * must not carry a share-alike claim.
 *
 * THE TEMPLATE IS INCLUDED DELIBERATELY (C1). It is the routing content most
 * likely to be copied, because it is designed to be copied: it carries the
 * mandatory-routing paragraph, the tree shape, the priority-on-collision
 * ordering and the rationalization block, which is exactly the expression
 * ATTRIBUTION.md section 5 claims. Shipping it without share-alike handed away
 * the deterrent ADR-048 calls the point of the whole split. This is not the
 * rejected "share-alike on the activate shims" alternative: a shim EXECUTES and
 * stays Apache-2.0, and the extension check below is what keeps that line.
 */
function isRoutingContent(path) {
  if (path === "README.md") return true;
  if (path.startsWith("docs/")) return true;

  const segments = path.split("/");
  if (segments.length > 3 && segments[0] === "overlays" && segments[2] === "flows") {
    return CONTENT_EXT.test(path);
  }
  if (path.startsWith("engine/templates/")) return CONTENT_EXT.test(path);

  return false;
}

/**
 * @param {string} path repo-relative path, POSIX separators (as `git ls-files` emits)
 * @returns {"CC-BY-SA-4.0"|"Apache-2.0"|"license-text"|null} null means UNCLASSIFIED
 */
export function licenseFor(path) {
  if (typeof path !== "string" || path === "") return null;

  const rel = path.replace(/\\/g, "/").replace(/^\.\//, "");

  if (LICENSE_TEXTS.has(rel)) return "license-text";
  if (isRoutingContent(rel)) return "CC-BY-SA-4.0";
  if (EXECUTING.test(rel) || KNOWN_META.has(rel)) return "Apache-2.0";

  return null;
}
