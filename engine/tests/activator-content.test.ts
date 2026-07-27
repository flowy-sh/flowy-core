import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ============================================================
   ACTIVATOR CONTENT LOCK (2026-07-25)

   The activator carries the receipt-not-promise ordering, and it
   is the MORE load-bearing half of that fix: the hook banner is
   ~40 tokens re-injected per prompt, but this file is the durable
   instruction the model reads at activation.

   It shipped with ZERO coverage — the plan's own verification step
   was literally titled "Verify nothing asserted on that prose",
   which is true and is exactly the problem (ce:review P1). Prose
   with no test is prose that can be silently reverted by anyone
   who finds the wording bossy.

   These are CONTENT LOCKS, not behavior tests. They cannot prove
   an agent obeys the instruction — only that the instruction still
   says what the 0.4.0 decision record says it says. The behavioral
   claim is measured separately (see docs/decisions/
   2026-07-25-receipt-not-promise.md, "How we will know it worked").
   ============================================================ */

const SKILL_MD = join(import.meta.dir, "..", "skills", "_activator", "SKILL.md");
const md = readFileSync(SKILL_MD, "utf8");

describe("activator: receipt-not-promise ordering is intact", () => {
  test("the file is readable and non-trivial (guards a broken path)", () => {
    expect(md.length).toBeGreaterThan(2000);
  });

  test("instructs INVOKE first, RECORD second", () => {
    expect(md).toMatch(/invoke first.*record second/is);
  });

  test("names the routing line a RECEIPT, not a plan", () => {
    expect(md).toMatch(/RECEIPT/);
    expect(md).toMatch(/never a plan/i);
  });

  test("binds 'invoke' to an actual Skill tool call", () => {
    expect(md).toMatch(/actual Skill tool call/i);
    // The ambiguous reading — "I followed the skill from memory" — is the
    // failure mode, so the text must rule it out explicitly.
    expect(md).toMatch(/from memory[^.]*is NOT invoking/i);
  });

  test("names the anti-pattern as a VIOLATION", () => {
    expect(md).toMatch(/VIOLATION, not compliance/i);
  });

  // THE assertion that actually catches a silent revert. Everything above can
  // coexist with reintroduced promise-framing elsewhere in the file; this one
  // fails the moment the old state-then-invoke wording comes back.
  test("the OLD promise-framed wording has not returned", () => {
    expect(md).not.toMatch(/state the routing decision out loud/i);
  });

  test("uses the SAME Routing grammar the hook banner mandates", () => {
    // ce:review P2: the banner demanded 'Routing: <skill> = YES,<reason>' while
    // this file taught 'Routing [<flow>]: <skill> — <reason>' — two competing
    // literal templates for the one artifact the release is built around.
    // The banner's per-skill YES/NO form is canonical; the flow-name prefix is
    // an optional disambiguator when several Flows are active.
    expect(md).toContain("Routing: <skill> = YES,<reason>");
  });
});
