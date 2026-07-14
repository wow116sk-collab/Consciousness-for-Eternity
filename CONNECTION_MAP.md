# Cross-Document Connection Map

**Scope:** LMU · CoE · Synthetic Body · Robotic Mining
**Purpose:** one index of how the four documents connect, structured so each entry is a self-contained block you can split into its own file/topic in git.
**Author of frameworks:** Pitarn Rungsiyapornratana. **Map assembled:** 2026-07-03.
**Discipline carried over:** every link carries (a) its *type*, (b) the *epistemic status of the link itself*, (c) *where* it lives in the source docs. Links derived in analysis (not stated in any doc) are quarantined in §4 and marked as such — they are **not** presented as if the documents assert them.

---

## 0. Document registry

| Code | File | Scope | Standalone? | Tag system it uses |
|---|---|---|---|---|
| **LMU** | `LMU_V3_29_consolidated` | Cyclic cosmology — matter ladder, dark-energy field, L0 closure, aeon transition | No — declared *contained within* CoE (ontology), but *evidentially firewalled* | `[Fact] [Fact-theory] [Hypothesis] [Speculation] [Design] [Open] [Dead-end] [Auditor]` |
| **CoE** | `Consciousness_for_Eternity` | Consciousness / substrate / block-universe / survival ledger | Is the container doc (defines the shared ontology) | `[ESTABLISHED] [THEORETICAL] [MINORITY VIEW] [CONTESTED] [HYBRID SYNTHESIS] [USER'S OWN] [SPECULATIVE]` + `[Fact-eq]` |
| **SB** | `synthetic_body_design_V1_4` | Engineering of a synthetic body / brain-preservation vessel | Yes (engineering brief); couples to CoE at the identity + brain-preservation joints | `[Fact] [Hypothesis] [Speculation] [unverified]` + `[USER'S OWN] [HYBRID SYNTHESIS]` |
| **RM** | `Robotic_Mining_Architecture_Notes.md` | Off-world robotic-mining architecture | **Yes — explicitly "not part of LMU cosmology"** (evidential); connects only by method + ontology-chain | `[Fact] [Hypothesis] [Speculation] [unverified]` |

**Tag-system note.** LMU and CoE use *different* legends. Rough cross-map for anyone slicing these apart: LMU `[Fact]` ≈ CoE `[ESTABLISHED]`; LMU `[Hypothesis]` ≈ CoE `[HYBRID SYNTHESIS]`/`[SPECULATIVE]`; CoE additionally uses `[Fact-eq]` (derived-from-Fact with the numbers shown); the LMU legend does not include it. Do **not** silently merge the two legends when combining files.

---

## 1. How to read a connection entry

**Link type**
- `ONT` — ontological: the two share the *same underlying stuff* (substrate / ream / slides / L0). If the shared ontology fails, both fail together.
- `EVID` — evidential firewall: a deliberate *barrier* — results are **not** passed across, even though the ontology is shared. (Firewalls are connections too; see §5.)
- `METH` — methodological: shared *operating principle* or *discipline*, not shared content.
- `FORK` — mutually-exclusive choice: the two sit on *incompatible* foundational commitments; you must pick per track.

**Status of the link itself** (separate from the status of the claims inside each doc)
- `[declared]` — the connection is stated in the source doc (citable).
- `[derived]` — the connection was worked out in analysis; not in any doc. → lives in §4.
- `[thematic]` — a resemblance only; no structural load.

**Strength** uses the author's own tie-break rule: `[Fact]` / `[Fact-eq]` (checkable) beats `[Hypo]` (a tie, either may be adopted).

---

## 2. Master connection index

| ID | Type | Endpoints | Status | Strength | One line |
|---|---|---|---|---|---|
| C1 | ONT | LMU ⊂ CoE | `[declared]` | posit `[SPECULATIVE]`; containment `[USER'S OWN]` | Same substrate/ream; LMU aeon = a sub-sequence of slides; L0 = stacking axis |
| C2 | FORK | CoE-transport ⊥ SB | `[declared]` | `[Hypo]` (identity criterion — physics silent) | Parfit/pattern vs Olson/animalist — cannot both be foundational |
| C3 | ONT+content | CoE ↔ SB | `[declared]` | mixed — see entry | Brain-preservation / bioprinting / layer-3 regeneration bridge |
| C4 | METH | all four | `[declared]` (RM states it) | `[Design]` principle | "hit a structural wall → route around/exploit, never smash" |
| C5 | METH | all four | `[declared]` | n/a (a practice) | Shared epistemic-tag system + decision-log discipline |
| C6 | ONT | LMU ↔ CoE | `[declared]` | `[Fact-eq]` (mechanism); channel `[USER'S OWN]` | entropy-as-record = the *impersonal* continuity channel that passes the no-hair wall |
| C7 | ONT | substrate ↔ L0 | `[derived → §4]` this-analysis | structure `[Fact-eq]`; existence split — see D4 | L0 is the thermodynamic *face* of substrate seen from inside a cycle |
| C8 | ONT-chain | RM → box | `[derived → §4]` this-analysis | `[Fact]` (by definition of ream) | Mining reaches the box via human → tool → tool-of-tool, far down the chain |

Derived results (D1–D4) and the firewall map (§5) follow.

---

## 3. Connections — expanded (each block is graftable)

Each block below is written to stand alone if you copy it into its own `.md` in git. Anchors are stable (`#c1` … `#c8`).

---

### C1 — LMU ⊂ CoE : shared ontology {#c1}

- **Type:** `ONT` **Status:** `[declared]`
- **Where:** CoE **§4.13(h)** ("Architectural note — LMU ⊂ CoE (containment)"); glossary entries *ream*, *stacking-axis/worldline time (L0)*; LMU prologue.
- **What connects:** Both run on one ontology — **3D slides stacked into one `ream` on one inert `substrate`**. A single LMU per-aeon cosmological state = a *sub-sequence of slides*, not one slide. LMU's base clock **L0** is *identified with* CoE's stacking-axis time.
- **Two bounded consequences (from the doc):**
  1. Shared foundation *by intent* — if the substrate/slide ontology fails, **both fail together** (author accepts this "linked fate").
  2. Containment is **ontological, not evidential** — CoE does **not** import LMU's still-open derivations (Λ₀, S_crit, channel weights, γ universality, a dS/CFT construction). See firewall **F1** in §5.
- **Strength of the link:** the *containment architecture* is `[USER'S OWN]`; the *substrate it rests on* is `[SPECULATIVE]` (pre-geometric extension) over `[ESTABLISHED]` block geometry (Minkowski 1908).
- **Grafts with:** C6, C7 (they are the mechanics of this shared ontology); F1 (its firewall).

---

### C2 — Identity fork : CoE-transport ⊥ Synthetic Body {#c2}

- **Type:** `FORK` **Status:** `[declared]`
- **Where:** CoE **§4.9** (Consciousness Transport Protocol, V2.20 correction — "Program-level fork"); glossary *Copy vs continuity — manufactured vs transported*.
- **What connects (as opposition):** the two tracks commit to **incompatible identity criteria**:
  - **CoE mind-transfer** (scan → transmit → bioprint → destroy original) commits to **Camp A = Parfit / pattern view** ("a psychologically-continuous successor counts as you").
  - **Synthetic Body** (retain the original biological brain; no scan, no copy) commits to **Camp B = Olson / animalist view** ("the copy is a just-started twin; the original died").
- **The doc's own ruling:** *"These are mutually exclusive as foundations — one cannot treat both as simultaneously correct. Pick per track and state it."*
- **Strength:** the fork itself is `[Hypo]` — physics is silent on the identity criterion (Parfit 1984 vs Olson 1997); it turns on the *definition* of "you," not a measurement. The **process** underneath (§4.9 is copy-then-destroy) is `[Fact]`; the **divergence** of the bioprinted twin is `[Fact-eq]` (MZ-twin data). Only the "does the successor count as you" verdict is the open tie.
- **Grafts with:** D1 (why this fork goes *vacuous* at LMU aeon scale), D2 (why "transport" is a category error).

---

### C3 — Brain-preservation bridge : CoE ↔ SB {#c3}

- **Type:** `ONT` + shared engineering content **Status:** `[declared]`
- **Where:** CoE **§4.9** (bioprinting steps), **§4.4** (multi-layer tuning signature), **§4.12** (physical channels reach only the tuner); SB **§2.1** (brain perfusion), **§11** (transfer protocol), **§16** (scope / space).
- **What connects:** CoE's transport step 3 invokes bioprinting (Atala; Feinberg FRESH) as the receiver mechanism; SB is the *engineering-grade, do-able-now* version of keeping the brain alive — the same problem CoE treats speculatively. Both hit the **same wall: layer-3 (microtubule quantum-dynamical) regeneration**. CoE calls it "the framework's crucial assumption"; SB routes *around* it by never removing the original brain.
- **Strength:** the bioprinting components are `[Fact]` at lab scale, `[Speculation]` at whole-organ scale; the layer-3-regeneration assumption is `[SPECULATIVE]` and is the shared failure point.
- **Grafts with:** C2 (SB's "keep the brain" choice *is* the Camp-B commitment).

---

### C4 — "Route around, don't smash" : all four {#c4}

- **Type:** `METH` **Status:** `[declared]` (RM states it verbatim)
- **Where:** RM onboarding + "organizing principle" + "Link back to the cosmology framework": *"hit a structural wall → route around or exploit it, never smash it."* SB scope statement (reject terraforming/colony on biology grounds). LMU prologue (route entropy to L0 rather than crush matter to reignite).
- **What connects:** one operating principle across all four:
  - LMU: entropy can't be un-maxed → change the *frame* at the conformal boundary / dilute into L0, don't re-light the dead fire.
  - SB: sub-1g biology can't be engineered away → build a synthetic body, don't fight the biology.
  - RM: comms delay 1.3 s can't be removed → use it as a *fallback*, don't force full autonomy; Mars can't hold atmosphere → use as *depot*, don't terraform.
- **Strength:** a `[Design]` principle, not a result. It is the *reason the docs feel like one corpus* even where they share no content.
- **Note:** this is the **weakest** kind of link (methodological). It does **not** put RM inside the ontological box — see C8 and F2.

---

### C5 — Tag + decision-log discipline : all four {#c5}

- **Type:** `METH` **Status:** `[declared]`
- **Where:** every doc's tag legend; CoE §4.9 explicitly: *"following the explicit decision-log discipline carried over from the author's LMU work"*; CoE's Type-A/Type-B analysis is lifted from LMU.
- **What connects:** shared method — every claim pinned to `[Fact]`/`[Hypo]`/etc.; dead-end logs ("check before extending anything"); added-not-overwritten revision rule; recompute-don't-inherit (LMU R6).
- **Strength:** a practice, not a claim. It is the corpus's signature and the thing that makes cross-doc auditing possible at all.
- **Operational value for git:** if you split files, **keep each file's tag legend in its own header** — the two legends (LMU vs CoE) are not interchangeable (see §0 note).

---

### C6 — entropy-as-record : the impersonal continuity channel {#c6}

- **Type:** `ONT` **Status:** `[declared]`
- **Where:** CoE **§4.13(f)** (the "negative" of a read), **§4.13(g)** (impersonal closure), **§4.5.1** (entropy is a *count*, not a *content*); LMU Part III §7 (entropy diluted, not reset).
- **What connects:** entropy rise **is** the lost inter-branch coherence of a read — the *record that a read happened*, [Fact-eq]. This is the **one channel that crosses the no-hair wall between aeons**, precisely *because it carries no identity*: it transmits "something happened" + a direction, not a self. This is what your opening question ("besides time-entropy, what connects?") sits on top of — time-entropy is the *foundational* link; the others (C1–C5, C7–C8) are the ones layered above it.
- **Critical guard (keep this line intact when slicing):** entropy records **that** a read occurred (a count, `S = k ln W`), **not** the read's *value* (content). "Read the value back out" is `[Fact]`-**false** (no-hair leaves 3 numbers; Holevo; Hayden–Preskill; entropy is *hidden* info = the direction of dispersal, not a carrier back). Rejected route = LMU/CoE decision-log **L7**.
- **Grafts with:** D2 (the confabulation mechanism that this channel *permits* — impersonal pattern resonated with, then misread as memory).

---

*C7 — substrate = root of L0: `[derived → §4]` (block moved to §4).*
---

*C8 — Mining ∈ box via ontology-chain: `[derived → §4]` (block moved to §4).*
---

## 4. Derived results — analysis only, NOT in source docs

> Everything in §4 was worked out in analysis and is **not asserted by the documents**. Tagged per the author's own rule so nothing derived masquerades as established. Keep this section clearly separated if committed.

### D1 — The identity fork is *vacuous* at aeon scale {#d1}
- **Claim:** the Parfit/Olson fork (C2) does **not** propagate into LMU as a live choice — it goes vacuous, because the aeon transition **leaves no continuity of any kind** for the two camps to disagree about.
- **Why `[Fact-eq]`:** the fork needs *some* surviving continuity to argue over. No-hair (Israel 1967, Carter 1971) leaves the survivor as **3 numbers** (M, J, Q); SMBH entropy ≈ 10¹⁰⁴ k_B (Egan–Lineweaver 2010) → surviving fraction ≈ 3/10¹⁰⁴ ≈ 0. Plus L0 is a *dilution* reservoir by design (Part III §6). With no pattern surviving, **even Parfit answers "not the same"** (his criterion is pattern-continuity, which is absent). Both camps answer identically → the fork collapses; it does not *select* Camp B, it **dissolves**.
- **Net:** "pick per track" (C2) works *because the tracks sit on different scales of the same axis*, not because they conflict on one scale.

### D2 — Continuity is manufactured, not transported (one mechanism, all scales) {#d2}
- **Claim:** "moving a self" (body-swap, aeon, déjà-vu) is in every case **"stumble onto data, then believe you are it"** — a self-authored construction, not a self travelling forward.
- **Why `[Fact]`-safe:** memory is reconstructive/generative (Schacter), false memory is easily built (Loftus), déjà-vu = misattributed familiarity (Cleary) — all `[Fact]`. A new tuner that resonates with an impersonal pattern in the ream **interpolates** and misreads its own construction as recall (CoE §4.13(g)).
- **Consequence:** the identity fork (C2) is not just vacuous at aeon scale — it is a **wrong question**: it asks "does the thing that travelled count as you?" when *nothing travelled*. Only a fresh construction that *believes* it travelled.
- **Falsifier kept (do not delete):** if a case shows **veridical, replicable detail** the new brain could not access, confabulation is insufficient and the framework yields — CoE §7.10 (the one potential Type-A test). No such replicable evidence exists as of the source docs → status `[Open]`, not confirmed.

### D3 — The "box" = substrate/ream (H-analogy; ontological, not predictive) {#d3}
- **Claim:** the base you were looking for is the already-named **substrate/ream**; it behaves like **H** (everything is *built from* / *traces down to* it), **not** like a "theory of everything" (which produces answers).
- **What the box does / does not do:**
  - ✅ is the layer LMU, CoE, SB, RM are *built from* / *trace down to* (ONT containment) — C1, C3, C8.
  - ✅ everything traces down to it (like every element traces to H).
  - ❌ does **not** *produce/predict* upper-layer behaviour — **emergence** (Anderson, "More is Different," 1972). This is exactly why CoE §4.13(h) writes "ontological **not evidential**."
- **Guard `[Fact]`:** a base that *produces every answer including its own* is `[Fact]`-false (Gödel 1931: consistent arithmetic-strong systems are incomplete and can't prove own consistency; + agent⊂universe, CoE §4.13(i)). The strong base is the one that *places* everything honestly — including marking what is out of reach — not the one that explains everything.
- **Two levels of "box" available:** `[ESTABLISHED]` ream/block (Minkowski 1908) — enough to hold all four docs — **or** `[SPECULATIVE]` pre-geometric substrate (deeper, unfalsifiable, CoE §6.1). The H-analogy fits the `[ESTABLISHED]` level *without* needing the substrate posit.

### D4 — L0 vs substrate : strength asymmetry {#d4}
- **Claim:** L0 is **stronger** than substrate, not weaker — despite being unmeasurable — because their *triggers* differ.
- **Numbers / basis:**
  - **L0's existence** is forced by two `[Fact]`s colliding (2nd law: total entropy must rise; low-entropy-start requirement: a fresh round needs a low-entropy start) → a reservoir is the only remaining exit. This is a **standalone cosmology problem** (low-entropy-initial-condition problem) — it bites *without CoE at all*. "Unmeasurable in principle" (LMU Part III §6) makes L0 **untestable in detail**, not **weak in existence**.
  - **Substrate's existence** hangs on the CoE posit "mind reads the block." Physics (`[Fact]`: LIGO GW energy; Casimir vacuum structure) only *excludes placements* (not spacetime, not vacuum) → tells you where the reader *would* sit *if* it exists; does **not** prove it exists.
- **Split to keep intact:** `L0-as-function (reservoir)` = `[Fact]`-forced; `L0-as-face-of-substrate` = `[posit]` (the identification, C7). The `[Fact]` on the function does **not** climb down to prove the pre-geometric identity.
- **Source's own honesty:** LMU tags this exactly — *"reservoir must exist"* = `[Fact]`; *"reservoir = unbounded L0"* = `[Design]`/`[Open]`, declared as **"the framework's one named point of failure (fork 5)."**

### C7 — substrate = root of L0 {#c7}

- **Type:** `ONT` **Status:** `[derived]` (worked out in analysis — **not** stated this way in the docs)
- **Where it touches the docs:** CoE §4.13(h) (L0 = stacking axis); LMU prologue §3 + Part III §6 (L0 as reservoir).
- **What the analysis found:** L0 and substrate are **not two neighbours that happen to be identified** — L0 is the **thermodynamic face** of the substrate *seen from inside a cycle*; substrate is the **ontological face** of the same layer *seen from outside time*. Same object, two viewing angles (mountain = "cliff to climb" to a climber, "fault line" to a geologist). This removes the coincidence of "two different pressures happening to land on one layer."
- **Strength / caution (important):** this is `[derived]`, and the derivation does **not** raise substrate's strength — see **D4**. Thermodynamic `[Fact]` forces only *"a reservoir must exist"* (a *function*), never *"that reservoir is a pre-geometric ground"* (an *identity*). Fact that props the branch does not flow back down to prove the root.
- **Grafts with:** C1 (this is the internal mechanics of the containment), D4 (the strength asymmetry).

---

### C8 — Mining ∈ box via ontology-chain {#c8}

- **Type:** `ONT-chain` **Status:** `[derived]` (this-analysis)
- **What the analysis found:** RM connects to the box **through a long chain**, not by being a primitive of it:
  `substrate → ream → slides → matter → life → human → human's tools → tools-of-tools = mining.`
  This is exactly how **DNA traces down to H** [Fact] (H → nucleoside → nucleotide → DNA) — nobody requires DNA to be "built directly from H"; tracing down the chain is what ontological containment *means*. Distance along the chain does not void the connection.
- **Reconciling with RM's "standalone":** RM's own line *"not part of LMU cosmology"* means **evidentially** separate (it borrows no LMU equation) — **not** ontologically outside the universe. Same structure as LMU⊂CoE: *in* the box (ontological), *firewalled* (evidential).
- **Strength:** `[Fact]` — true by definition of `ream` (every physical process lives in the block). Needs no substrate posit — `ream`/block (Minkowski, `[ESTABLISHED]`) already connects every physical process.
- **Grafts with:** C4 (RM's *other*, weaker link — the method), F2 (RM's evidential firewall).

---

## 5. Firewall map — what must NOT connect

> Firewalls are load-bearing. Over-connecting the corpus (importing results across these lines) breaks the author's discipline. Keep these explicit when slicing files.

| ID | Firewall | Between | Rule |
|---|---|---|---|
| **F1** | Evidential firewall (LMU→CoE) | C1's two faces | CoE may share LMU's *ontology* but must **not import** LMU's open results (Λ₀, S_crit, γ, channel weights, dS/CFT). CoE §4.13(h),(e). |
| **F2** | Evidential firewall (RM) | C8's ontology link | RM is *in* the ream but borrows **no** LMU equation ("not part of LMU cosmology"). Ontological-in, evidential-out. |
| **F3** | Cross-cycle reservoir guard | CoE survival ↔ LMU L0 | CoE's "return from the pool" must **not** lean on LMU's cross-cycle reservoir for *results* (strict domain separation). CoE §4.13(e). |
| **F4** | Thermodynamics ≠ pattern-survival | inside CoE, guards C6 | "death produces entropy" is **orthogonal** to "a pattern survives"; §4.5's "tuned merge" is **not** grounded in thermodynamics and must not be presented as if it were. CoE §4.5.1 (motte-and-bailey flag). |
| **F5** | count ≠ content (L7) | inside C6 | entropy records *that* a read happened, never the *value*; "read the value back" is `[Fact]`-false. Decision-log **L7**. |

---

## 6. Publishability slice (optional — likely a separate git branch)

Not a connection, but useful to keep with the map: which pieces detach cleanly for external review.

| Piece | Source | Detaches as | Status of *publishability* |
|---|---|---|---|
| Thawing scalar field vs DESI DR2 | LMU **Part II** | ~15-pg normal-science paper (KG-in-FRW vs DESI chains; pre-registered DESI-Y5 falsifier) | **Most ready** — topic is live (cf. Dinda–Maartens 2025; de Souza et al. 2025). `[Hypo]` on outcome. |
| BH population model + relic over-massiveness | LMU **Part I + VI** | astrophysics paper (ODE model → NGC 384 out-of-sample) | Second. Trim spin-axis (doc itself calls it fragile). |
| fork-5 quantitative bound on cyclic models | LMU **Part III §6** | foundations/GRG note (colonize ≥ (1+g) ≈ 10¹⁴·⁶ /generation) | **Possibly novel** — verify no prior bound in this form before claiming. |
| The loop / L0 / aeon-transition whole | LMU (all) | — | **Do not submit** — unfalsifiable by its own declaration; a referee will quote that line. |

---

## Appendix — anchor table (for cross-file linking after you split)

If you split each block into its own file, preserve these IDs so internal links survive:

```
#c1  LMU ⊂ CoE (shared ontology)
#c2  Identity fork (CoE-transport ⊥ SB)
#c3  Brain-preservation bridge (CoE ↔ SB)
#c4  Route around, don't smash (all four)
#c5  Tag + decision-log discipline (all four)
#c6  entropy-as-record (impersonal continuity channel)
#c7  substrate = root of L0            [derived]
#c8  Mining ∈ box via ontology-chain   [derived]
#d1  Fork vacuous at aeon scale         [derived]
#d2  Continuity manufactured not transported [derived]
#d3  Box = substrate/ream (H-analogy)   [derived]
#d4  L0 vs substrate strength asymmetry [derived]
#f1..f5  firewalls (do-not-connect)
```

**Provenance line for the map itself:** links marked `[declared]` are traceable to the cited section in the source docs; links marked `[derived]` were reasoned out in analysis (2026-07-03) and are **not** claims the documents make. Assembled by Claude against the author's tag legend; curation per the author's standing rules.

**Sync note (2026-07-12):** one map, three repos — this revision synced verbatim across LMU · CoE · SBA. Base = the LMU-side copy (registry already at `LMU_V3_29_consolidated`; C7/C8 quarantined in §4; corrected tag-system note). Two in-place fixes on that base: (1) master-index C8 strength aligned to its §4 block — `[Fact-eq]` → `[Fact]` (by definition of `ream`; no arithmetic shown, so `[Fact-eq]` did not apply); (2) restored the `#f1..f5` anchor line dropped from the appendix in an earlier LMU-side edit. The CoE/SBA copies this supersedes were the 2026-07-03 assembly (registry `LMU_V3_25`, RM filename `_2`, pre-quarantine C7/C8). Net effect: accuracy/consistency only — no link added, removed, or re-typed.
