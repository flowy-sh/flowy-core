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
 * SPDX-License-Identifier: Apache-2.0
 */

export const LICENSE_BUCKETS = ["CC-BY-SA-4.0", "Apache-2.0", "license-text"];

/** Verbatim third-party legal texts. We did not write them and do not license them. */
const LICENSE_TEXTS = new Set(["LICENSE", "LICENSE-CODE"]);

/**
 * Routing content: the selection, ordering, and wording of the routes. This is
 * the work share-alike is meant to protect.
 *
 * Deliberately scoped to `overlays/<name>/flows/...`. A FLOW.md living anywhere
 * else (an engine test fixture, say) is not shipped routing and must not carry a
 * share-alike claim.
 */
function isRoutingContent(path) {
  if (path === "README.md") return true;
  if (path.startsWith("docs/")) return true;

  const segments = path.split("/");
  return segments.length > 3 && segments[0] === "overlays" && segments[2] === "flows";
}

/**
 * @param {string} path repo-relative path, POSIX separators (as `git ls-files` emits)
 * @returns {"CC-BY-SA-4.0"|"Apache-2.0"|"license-text"|null}
 */
export function licenseFor(path) {
  if (typeof path !== "string" || path === "") return null;

  const rel = path.replace(/\\/g, "/").replace(/^\.\//, "");

  if (LICENSE_TEXTS.has(rel)) return "license-text";
  if (isRoutingContent(rel)) return "CC-BY-SA-4.0";

  return "Apache-2.0";
}
