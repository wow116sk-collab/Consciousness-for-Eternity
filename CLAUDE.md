# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a software project** — there is no build, test, or lint step, and no application code. It is the version-controlled archive of a single scholarly manuscript: *Consciousness for Eternity (CoE)*, a metaphysical framework held to strict epistemic and attribution discipline. Work here is **editing prose and its metadata**, not writing code. Treat it like maintaining a peer-reviewed document under a rigorous house style.

The author is Pitarn Rungsiyapornratana. The work is archived on Zenodo (concept DOI `10.5281/zenodo.21156743`) and released under CC BY 4.0.

## The single source of truth

`Consciousness_for_Eternity.md` (~1340 lines) is the **canonical document**. Everything else is derived from it or describes it:

- `Consciousness_for_Eternity_v2.24.pdf` — a generated reading view. It is committed at the repo root (the `.gitignore` `/rendered/` rule and commented-out `*.pdf` rule anticipate a future move to a generated-only workflow, but the current PDF is tracked and named with its version).
- `README.md`, `CITATION.cff`, `.zenodo.json` — metadata *about* the document (title, version, DOI, keywords, license).
- `CONNECTION_MAP.md` — a cross-document index tying CoE to three sibling frameworks (see below).

When the `.md` and any of these disagree, **the `.md` is authoritative** and the others must be corrected to match.

> Note: `gitignore` (no dot) at the repo root is a byte-identical duplicate of `.gitignore`. It is inert (git only honors `.gitignore`). Leave it unless asked to clean it up.

## The four-track program (context, mostly external)

CoE is the master ontology in a larger program. Only CoE lives in this repository; the others are maintained separately and are referenced by `CONNECTION_MAP.md`:

- **CoE** — this document (consciousness, time, cosmology). The container that defines the shared ontology.
- **LMU** — Loop Mega Universe (cyclic cosmology). Declared *ontologically contained within* CoE but **evidentially firewalled** — CoE must **not** import LMU's still-open derivations.
- **SBD / SB** — Synthetic Body Architecture.
- **RM** — Robotic Mining / ISRU.

`CONNECTION_MAP.md` catalogs the links (`C1`–`C8`, plus derived `D1`–`D4` and firewalls in §5). Each link is typed (`ONT` / `EVID` / `METH` / `FORK`) and carries the epistemic status *of the link itself* (`[declared]` / `[derived]` / `[thematic]`). LMU and CoE use **different tag legends** — do not silently merge them (the map's §0 gives the cross-walk).

## Editorial conventions — the load-bearing rules

These are what make edits correct or incorrect here. Internalize them before changing any content.

### 1. Epistemic labelling is mandatory
Every substantive claim carries a tag. Two systems coexist:

- **Prose tags** (main document body): `[ESTABLISHED]`, `[THEORETICAL]`, `[MINORITY VIEW]`, `[CONTESTED]`, `[HYBRID SYNTHESIS]`, `[USER'S OWN]`, `[SPECULATIVE]`.
- **Audit tags** (objections, decision log, tight arguments): `[Fact]` (measured/peer-reviewed), `[Fact-eq]` (derived from a Fact, **with the numbers shown**), `[Hypo]` (assumption).

Any new claim you add must be tagged, and a `[Fact-eq]` must show its arithmetic. Never relabel an `[ESTABLISHED]`/`[Fact]` anchor to prop up a speculative point.

### 2. "Added, not overwritten"
This is the strongest standing rule. When a claim is corrected, superseded, or resolved, the **original wording stays** and a dated note is appended beside it (e.g. "superseded in place", "(V2.16 precision)"). Resolved decision-log rows record the decision and its reason rather than being deleted. Do **not** delete or silently rewrite prior text — append.

### 3. Attribution discipline
Others' ideas are credited by name at the point of use. Adapted ideas are marked `[HYBRID SYNTHESIS]`; only what the author originated is `[USER'S OWN]`. Where published researchers independently reach a CoE position, cite them **"for priority, not confirmation"** — convergence raises robustness, not truth, and each such citation names the single result borrowed and states where it differs (the "contamination guard"). Framing is always "also held by / independently reached", never "confirmed by".

### 4. The provenance gate (§9.2)
A source enters only after verification against its **primary record**. Provenance integrity is a hard gate, not a downgradable tag — a citation that fails (e.g. an LLM-authored or non-existent-venue source) is **excluded entirely**, not tagged `[SPECULATIVE]`. Items awaiting primary verification are held out and flagged, not folded in.

### 5. The dead-log (§9.3, rows L1–L16)
Abandoned routes are logged in a structured table so they are **not silently re-attempted**. Before proposing any new mechanism, check whether it is already cut — common re-derivations (entropy-as-carrier = L4; "mind = entropy wave / body-as-antenna" = L7; cross-slice content reading = L16; transport-as-move = L15) are already closed. Each row records: what was cut, on what grounds (label + number), how it conflicts, what was chosen instead, and why.

### 6. The Type-A / Type-B test (§9.2)
Classify any proposed fix: **Type-B** re-attributes an effect to known physics (assume this by default); **Type-A** is genuinely new physics that would strengthen the distinctive claim (requires evidence). State the classification explicitly.

### 7. Net-effect framing in changelog entries
Every changelog entry states its **net effect** — typically "subtractive", "accuracy/consistency", "organisational", or "honesty-tightening" — and almost always ends by noting whether the §9.4 standing verdict changed (it rarely does). New entries should follow this shape.

## Document structure (for navigation)

The `.md` opens *directly into content* (Purpose → Table of Contents → §1–§9), with all bookkeeping at the end:

- **§1** Glossary · **§2** Established science the framework rests on · **§3** Theoretical frameworks drawn on · **§4** The synthesis (§4.1–§4.13, the core) · **§5** Phenomena explained · **§6** Open problems & objections · **§7** Suggested tests · **§8** Further reading · **§9** Methodology, standing rules, and decision log (incl. §9.3 dead-log table).
- **Appendix A — Revision History** holds the full changelog and the version-numbering note. It was moved out of the front matter in V2.22 deliberately; keep it there.

Section numbering is sequential and gap-free, and every `§N.M` cross-reference must resolve to a real header. A structural sweep (V2.17) checks numbering, cross-references, dead-log IDs, table column integrity, and balanced markup — run the same checks after structural edits.

## Versioning — what to update on a release

Version tags are **not monotonic by history** (the scheme restarted once: true order is V1 → V2 → V3 → V1.4 → … → V2.23). The **canonical version is the top line of the `.md`** (currently V2.24); future revisions continue monotonically from there (next = V2.25). The leading digit is held at `2` so point-releases never collide with the legacy coarse `V3` content-generation tag.

When bumping the version, update **all of these together** so they never disagree:

1. `Consciousness_for_Eternity.md` — the `**Version X — Working Document**` top line, **and** a new dated "What's new in Vx" entry in Appendix A.
2. `CITATION.cff` — `version:` and `date-released:`.
3. `README.md` — the citation block version and the "(Version X)" reference.
4. The committed PDF — regenerate from the `.md` and rename to `Consciousness_for_Eternity_vX.pdf` (delete the prior-version PDF, as was done for v2.22 → v2.23).
5. `.zenodo.json` carries no version field (Zenodo derives it), but keep its title/description/keywords in sync with `CITATION.cff` and the `.md`.

## Git workflow

- Development branch for current work: **`claude/claude-md-docs-cthonv`**. Create it from the latest `main` if absent; never push to `main` without explicit permission.
- Push with `git push -u origin <branch-name>`; retry network failures with exponential backoff.
- Do **not** open a pull request unless explicitly asked.
- Commit messages should be clear and descriptive; mirror the changelog's discipline (state what changed and its net effect).
