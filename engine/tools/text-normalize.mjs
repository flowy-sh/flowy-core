/**
 * One place that decides what "the same text" means.
 *
 * Three modules each answered this separately and one of them got it wrong:
 * flow-rules.mjs split on "\n" without stripping CR, so every `##` heading was
 * invisible on a Windows checkout and two of its own tests failed on a fresh
 * clone. JS `.` does not match `\r`, so `/^##\s+(.*)$/` captured a heading whose
 * text ended in a carriage return, and `/^routing/i` never matched it.
 *
 * Interior line COUNT is preserved, so `line N:` messages stay correct. Only
 * trailing blank lines collapse, and nothing meaningful lives there.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export function normalizeText(text) {
  return String(text ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n*$/, "\n");
}

export function normalizeLines(text) {
  return normalizeText(text).split("\n");
}
