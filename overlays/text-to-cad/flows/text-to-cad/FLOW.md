# FLOW.md: Text to CAD Flow

> Routes the 12 Text to CAD skills (parametric CAD, drawings, manufacturability checks, G-code and robot description files) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by earthtojake (https://github.com/earthtojake/text-to-cad, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ creating or editing a parametric CAD model or exporting STEP, STL, 3MF or GLB?  → invoke text-to-cad:cad   gate: geometry measured after export
  ├─ generating or validating a 2D DXF drawing?                                      → invoke text-to-cad:dxf
  ├─ engineering drawing PDF of a part wanted?                                       → invoke text-to-cad:engineering-drawing
  ├─ part for sheet metal, CNC or injection molding?                                 → invoke text-to-cad:dfm   gate: bends, reliefs and tooling reviewed
  ├─ mesh headed to a 3D printer?                                                    → invoke text-to-cad:dfam-check   gate: printability findings per process
  ├─ slicing a model to G-code?                                                      → invoke text-to-cad:gcode
  ├─ sending a print to a Bambu Lab printer?                                         → invoke text-to-cad:bambu-labs
  ├─ DXF or STEP upload for SendCutSend?                                             → invoke text-to-cad:sendcutsend
  ├─ need a purchasable off-the-shelf CAD part?                                      → invoke text-to-cad:step-parts
  ├─ authoring or validating a .urdf robot description?                              → invoke text-to-cad:urdf
  ├─ authoring or validating a .srdf MoveIt2 file?                                   → invoke text-to-cad:srdf
  ├─ authoring SDFormat models or worlds?                                            → invoke text-to-cad:sdf
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (text-to-cad:cad or text-to-cad:dfm)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `text-to-cad:<slug>` in the separately-installed earthtojake/text-to-cad plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Manufacturability**: a part headed to fabrication gets dfm or dfam-check before it is ordered.
2. **Model first**: no model means cad before drawings or exports.
3. **Robot files**: urdf before srdf.
4. Everything else in lifecycle order.

## Phases

1. **Model**: text-to-cad:cad. Gate: model exports and measures correctly.
2. **Check**: text-to-cad:dfm or text-to-cad:dfam-check. Gate: findings resolved.
3. **Document**: text-to-cad:engineering-drawing or text-to-cad:dxf. Gate: drawing validates.
4. **Make**: text-to-cad:gcode, text-to-cad:bambu-labs or text-to-cad:sendcutsend. Gate: output file produced.

**Shortcuts:** Print -> cad -> dfam-check -> gcode -> bambu-labs. Cut part -> cad -> dxf -> dfm -> sendcutsend. Robot -> urdf -> srdf.

## You are rationalizing if you think…

- "The dimensions look right." → cad. Measure the exported geometry.
- "It will print fine." → dfam-check before slicing.
- "I can write the URDF from memory." → urdf. Validate it.
- "Just order it." → dfm and sendcutsend review the upload first.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by earthtojake, MIT (https://github.com/earthtojake/text-to-cad). FLOW.md routing by Flowy, CC-BY-SA-4.0.
