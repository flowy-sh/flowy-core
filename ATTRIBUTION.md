# Attribution required

**This file specifies how to credit Flowy.** The other `ATTRIBUTION.md` files, the ones
inside `overlays/*/flows/*/`, do the opposite job: they credit the upstream authors whose
skills our Flows route to. Do not confuse the two.

CC BY-SA 4.0 section 3(a)(1) lets a licensor state the manner in which attribution must be
given. This is that statement. It binds anyone who copies, adapts, republishes, or builds on
the routing content listed in `NOTICE`, whether or not money changes hands.

You do not need permission. You need to follow this file.

---

## 1. What you must do

Every use of the routing content requires all five of these.

**1. Credit by name.** One string, exactly: `Routing by Flowy`. Not "Flowy-inspired". Not
"based on an open source router". Not a bare "Flowy". The name, in that form, wherever the
credit appears.

This file used to offer a second, longer form for surfaces with room. Two accepted strings
is one string too many: the whole point of specifying the manner of attribution is that a
copier meets the same terms everywhere, and the same string is what the fork notice in
`engine/hooks/flowy-inject.sh` hands over. A test pins the two together.

**2. A live, followable link to `https://www.flowy.sh`.** In HTML that means a real
`<a href="https://www.flowy.sh">` that a reader and a crawler can both follow: not
`rel="nofollow"`, not `rel="sponsored"`, not `display:none`, not behind a click, not a
redirect through your own tracker. In plain text, Markdown, or a terminal, the bare URL
`https://www.flowy.sh` is enough.

The host is `www`, and that is not a detail. The apex `flowy.sh` 308-redirects to it, so a
link to the apex is itself a redirect, which is the one thing the sentence above rules out.

This is the specified manner, and it is the point of the whole file. Attribution that a
reader cannot act on is not attribution.

**3. The license, named and linked.** `CC BY-SA 4.0`, linked to
`https://creativecommons.org/licenses/by-sa/4.0/`.

**4. A link to the specific file you took.** Not the repo root. The file. Example:
`https://github.com/flowy-sh/flowy-core/blob/main/overlays/ultra-powers/flows/ultra-powers/FLOW.md`

**5. A statement of changes, if you changed anything.** Required by section 3(a)(1)(B). One
line is fine: `Modified: reordered the debug routes, dropped the SEO branch.` If you changed
nothing, say nothing.

### A compliant credit, in full

> Routing by [Flowy](https://www.flowy.sh), from
> [`ultra-powers/FLOW.md`](https://github.com/flowy-sh/flowy-core/blob/main/overlays/ultra-powers/flows/ultra-powers/FLOW.md),
> licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
> Modified: dropped the GROW branch.

That is the whole obligation. It costs one line.

## 2. Where the credit has to appear

**On the surface where the routing is used, reachable by whoever is using it.**

If you ship a plugin, it goes in the README and in the routing file itself. If you run a
website that renders the routing, it goes on the page that renders it, not only in a
`LICENSE` file in a repo the reader will never open. If you ship a product whose agent reads
the routing at runtime, it goes in the docs a user of that product reads.

A credit buried where the audience for the copied work will not encounter it does not
satisfy section 3(a)(1). The test is simple: **can a person who found your copy find its
origin without already knowing the origin?**

## 3. Commercial use

CC BY-SA 4.0 permits commercial use. We are not asking you to stop. We are asking you to do
these two things, which are conditions of the license and not requests:

**Attribute, per section 1 above.** Every requirement applies identically to a paid product,
a funded startup, an ad-supported directory, and a hobby repo. There is no commercial
carve-out and there is no "we will link back later".

**Share alike, per section 3(b).** If you remix, transform, or build upon the routing
content, the thing you produce must be licensed under CC BY-SA 4.0 or a
[compatible license](https://creativecommons.org/compatiblelicenses). You may not add
technical measures or contractual terms that restrict what this license permits downstream
(section 2(a)(5)(B)). Concretely: you cannot take a Flow's routing, build a paid product on
it, and keep that derivative routing closed. Sell it if you like. Keep it open on the same
terms.

If share-alike is genuinely incompatible with your business, ask. `maximo@flowy.sh`. A
separate commercial license is a conversation, not a refusal.

## 4. What we do not claim

Stating this plainly is what makes the rest of the file worth taking seriously. We do not
claim, and will not assert a claim over:

- **Facts.** That a skill named `systematic-debugging` exists, who wrote it, what license it
  carries, what repository it lives in, how many stars it has. Facts are not copyrightable.
- **The idea** of routing an agent to a skill, of a router file, of a hook that reinjects
  context, of gates, or of phase ordering. Ideas and methods are not copyrightable. Build
  your own.
- **Anyone else's skills.** Every skill our Flows route to belongs to its author under its
  own license. We bundle none of them.
- **Short, functional strings.** A route line that reads `bug -> systematic-debugging` is
  close to the only way to say that. Take it.

## 5. What we do claim

The **selection, ordering, and expression** of the routing. Specifically:

- Which skills are in a Flow and which were deliberately left out.
- The order of the routing tree and the phase sequence.
- The wording of every gate, the exit condition attached to it, and the artifact it names.
- The disambiguation prose: the tiebreakers that say which of two overlapping skills wins,
  and why.
- The "You are rationalizing if you think..." blocks, their framing, and their replies.
- The priority-on-collision ordering.

This is selection-and-arrangement plus original expression. Two people independently
building a router over the same public skills do not produce the same forty routes in the
same order with the same gate nouns and the same refusal lines. When they match, it was
copied, and `PROVENANCE.md` is how that gets demonstrated rather than asserted.

## 6. How copying gets detected

Not by vibes. See [`PROVENANCE.md`](PROVENANCE.md) for the mechanism and
`engine/tools/flowy-provenance.mjs` for the tool that runs it. It reports exact-content
matches against published release hashes, declared canary strings, and structural route
overlap, and it prints the evidence rather than a verdict.

Run it on your own work if you want to know where you stand before we do.

## 7. If you are out of compliance

The ladder, in order, and we do not skip steps:

1. **An email.** Almost every case is an oversight, and almost every case ends here. You add
   a line, we say thanks, nothing else happens.
2. **A public, factual note** of what was copied and what is missing, if the email goes
   unanswered.
3. **Formal notice.** Section 6(a) terminates your license automatically on breach, and
   section 6(b) reinstates it if you cure within 30 days of discovering the violation. So
   the fastest way out of a formal problem is still to add the line.

We would rather have the link than the fight. That is the entire strategy: a copy that
attributes is distribution.

## 8. Not legal advice

This file states our licensing terms. It is not legal advice, and it does not modify
CC BY-SA 4.0, which governs. Where this file and the license text disagree, the license text
wins. If you are making a commercial decision that turns on any of this, talk to a lawyer.

---

Questions, permission requests, commercial licensing: **maximo@flowy.sh** · **https://www.flowy.sh**
