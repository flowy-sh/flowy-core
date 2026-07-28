import { test, expect } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { validateFlow } from "../tools/validate-flow.mjs";
import { join } from "node:path";

const fx = (n) => join(import.meta.dir, "fixtures", n);

test("good fixture validates clean", () => {
  const r = validateFlow(fx("good-flow"));
  if (!r.ok) console.error(r.errors.join("\n"));
  expect(r.ok).toBe(true);
  expect(r.errors).toEqual([]);
});

test("bad fixture fails: dangling skill + missing attribution", () => {
  const r = validateFlow(fx("bad-flow"));
  expect(r.ok).toBe(false);
  expect(r.errors.some((e) => /routed skill .*missing-skill.* not found/.test(e))).toBe(true);
  expect(r.errors.some((e) => /missing ## Attribution/.test(e))).toBe(true);
});

test("prose containing the word 'invoke' is NOT scanned as a route", () => {
  // The mandated R7 register sentence is "producing it when a trigger matched
  // and you did not invoke is a VIOLATION". The old regex matched `invoke
  // <word>` ANYWHERE, so it reported a routed skill named "is" and failed every
  // Flow that followed the standard. Fourth substring-vs-invocation defect
  // found today; the rule is the same each time: match how a thing is INVOKED,
  // in the position it is invoked, never a bare substring.
  const dir = fx("prose-invoke");
  const r = validateFlow(dir);
  expect(r.errors.some((e) => /routed skill "is"/.test(e))).toBe(false);
});

test("a route line still resolves its skill", () => {
  // The narrowing must not turn the check into a no-op.
  const r = validateFlow(fx("bad-flow"));
  expect(r.errors.some((e) => /routed skill .*missing-skill.* not found/.test(e))).toBe(true);
});

test("authoringRules is OFF by default so existing callers are unchanged", () => {
  // If this flips, the opt-in is not actually opt-in and the checks would fail
  // the repo on its own contents before the content is fixed.
  expect(validateFlow(fx("good-flow")).ok).toBe(true);
});

test("authoringRules:true surfaces rule errors on the same fixture", () => {
  // good-flow is a 15-line demo with no drift clause: a genuine negative case
  // for the new rules while staying valid under the old ones.
  const res = validateFlow(fx("good-flow"), { authoringRules: true });
  expect(res.ok).toBe(false);
  expect(res.errors.some((e) => /drift clause/i.test(e))).toBe(true);
});

test("a scaffolded repo carries every module validate-flow imports", () => {
  // validate-flow.mjs now imports flow-rules.mjs. scaffold-flow copies the
  // validator into each new repo's tests/ so it self-validates; a missing
  // transitive import would make every scaffolded repo die on `bun test`.
  const target = join(mkdtempSync(join(tmpdir(), "flowy-deps-")), "demo-flow");
  execFileSync("node", [join(import.meta.dir, "..", "tools", "scaffold-flow.mjs"), target, "demo", "Demo Flow"]);
  for (const f of ["validate-flow.mjs", "flow-scan.mjs", "flow-rules.mjs"]) {
    expect(existsSync(join(target, "tests", f))).toBe(true);
  }
});
