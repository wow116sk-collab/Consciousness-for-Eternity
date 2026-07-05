export const meta = {
  name: 'imperial-research',
  description: 'Opus emperor sizes and shapes his court to the question: difficulty sets the seat cap (3/10/20/30/50), workload shape trades Sonnet teams against Haiku breadth or adds Opus privy councilors; Fable adviser verifies',
  whenToUse: 'Research or analysis on a single question; the court scales from a 3-seat casual reply to a 50-seat deep investigation, shaped for retrieval-heavy or analysis-heavy work',
  phases: [
    { title: 'Imperial Edict', detail: 'Opus judges difficulty tier and workload shape, then issues computation and logic mandates', model: 'opus' },
    { title: 'Team Planning', detail: 'each Sonnet team splits its mandate into data pieces within its Haiku quota', model: 'sonnet' },
    { title: 'Data Gathering', detail: 'Haiku runners fetch raw content only, no summarizing', model: 'haiku' },
    { title: 'Team Synthesis', detail: 'each Sonnet team writes its report from the raw data', model: 'sonnet' },
    { title: 'Court Comparison', detail: 'divisions with 2+ teams convene a circle to compare reports for accuracy', model: 'sonnet' },
    { title: 'Privy Council', detail: 'analysis-heavy work seats extra Opus councilors who critique independently', model: 'opus' },
    { title: 'Imperial Analysis', detail: 'Opus reconciles divisions and council opinions into the final answer', model: 'opus' },
    { title: 'Adviser Review', detail: 'Fable adviser verifies the conclusion only — no task assignment', model: 'fable' },
  ],
}

const question = typeof args === 'string' ? args : (args && args.question)
if (!question) {
  throw new Error('Pass the research question via args, e.g. Workflow({name: "imperial-research", args: "..."})')
}

// ── Difficulty tiers: hard seat caps (distinct court members) ───────────
const TIERS = {
  casual: 3,   // small talk / trivial question — emperor answers directly
  easy: 10,    // simple research question
  medium: 20,
  hard: 30,
  extreme: 50,
}

// ── Workload shapes: how seats are allocated within the cap ─────────────
// retrieval_heavy: few Sonnet teams, pour everything into Haiku breadth
// analysis_heavy: more Sonnet teams + Opus privy councilors, minimal Haiku
// balanced: in between
const SHAPES = {
  retrieval_heavy: {
    teamsPerDivision: { easy: 1, medium: 1, hard: 2, extreme: 2 },
    councilors: { easy: 0, medium: 0, hard: 0, extreme: 1 },
    maxRunnersPerTeam: 99, // no per-team ceiling — the seat budget is the limit
    minRunnersPerTeam: 2,
  },
  balanced: {
    teamsPerDivision: { easy: 1, medium: 2, hard: 2, extreme: 3 },
    councilors: { easy: 0, medium: 0, hard: 1, extreme: 2 },
    maxRunnersPerTeam: 4,
    minRunnersPerTeam: 2,
  },
  analysis_heavy: {
    teamsPerDivision: { easy: 1, medium: 2, hard: 3, extreme: 4 },
    councilors: { easy: 0, medium: 1, hard: 2, extreme: 3 },
    maxRunnersPerTeam: 2,
    minRunnersPerTeam: 1,
  },
}

// ── Phase 1: the Emperor judges difficulty + shape, issues mandates ─────
phase('Imperial Edict')

const EDICT_SCHEMA = {
  type: 'object',
  properties: {
    difficulty: {
      type: 'string', enum: ['casual', 'easy', 'medium', 'hard', 'extreme'],
      description: 'casual = small talk / trivial (answer directly); easy = one factual thread; medium = a few contested threads; hard = many threads needing triangulation; extreme = only for genuinely deep, multi-front investigations',
    },
    shape: {
      type: 'string', enum: ['retrieval_heavy', 'balanced', 'analysis_heavy'],
      description: 'retrieval_heavy = the bottleneck is FINDING information (broad search, many sources); analysis_heavy = information is thin or already at hand and the bottleneck is REASONING; balanced = both matter',
    },
    emphasis: {
      type: 'string', enum: ['equal', 'computation', 'logic'],
      description: 'Which division deserves the extra team if the question is lopsided',
    },
    computation_mandate: { type: 'string', description: 'What the COMPUTATION division must establish (empty string if casual)' },
    logic_mandate: { type: 'string', description: 'What the LOGIC division must establish (empty string if casual)' },
    shared_context: { type: 'string', description: 'Background every team needs (empty string if casual)' },
    direct_answer: { type: 'string', description: 'ONLY for casual difficulty: your direct answer to the question. Empty string otherwise.' },
  },
  required: ['difficulty', 'shape', 'emphasis', 'computation_mandate', 'logic_mandate', 'shared_context', 'direct_answer'],
}

const edict = await agent(
  'You are the Emperor (Opus), supreme orchestrator of a research court. Seat caps by difficulty: ' +
  'casual=3, easy=10, medium=20, hard=30, extreme=50 (you, your adviser, Sonnet team leads, circle ' +
  'chairs, privy councilors, and Haiku runners all count).\n' +
  'Question: ' + question + '\n\n' +
  'Step 1 — judge DIFFICULTY honestly; do not inflate small talk or simple lookups into research.\n' +
  'If casual: answer the question yourself in direct_answer, leave mandates empty, and stop.\n\n' +
  'Step 2 — judge the workload SHAPE:\n' +
  '- retrieval_heavy: the hard part is gathering lots of information → the court will field FEW ' +
  'Sonnet teams and spend the seats on many Haiku runners working in parallel.\n' +
  '- analysis_heavy: little to retrieve; the hard part is reasoning → the court will field MORE ' +
  'Sonnet teams plus Opus privy councilors at the top, and few Haiku runners.\n' +
  '- balanced: both matter.\n\n' +
  'Step 3 — pick which division (computation = quantitative evidence, logic = argument and ' +
  'consistency) deserves emphasis if the question is lopsided, then issue one mandate per division ' +
  'for the SAME question. Do NOT answer a non-casual question yourself.',
  { label: 'emperor:edict', model: 'opus', schema: EDICT_SCHEMA }
)

// ── Casual path: no court is convened ───────────────────────────────────
if (edict.difficulty === 'casual') {
  log('Casual question — the Emperor answers directly (no court convened)')
  phase('Adviser Review')
  const casualCheck = await agent(
    'You are the Emperor’s adviser. He answered a casual question directly.\n' +
    'Question: ' + question + '\nHis answer: ' + edict.direct_answer + '\n\n' +
    'Verify briefly: is the answer correct and appropriate? Return OK, or the correction needed.',
    { label: 'adviser:review', model: 'fable', effort: 'low' }
  )
  return { question: question, difficulty: 'casual', seats_used: 2, answer: edict.direct_answer, adviser_review: casualCheck }
}

// ── Size the court deterministically from tier + shape ──────────────────
const CAP = Math.min(TIERS[edict.difficulty], (args && args.max_agents) || Infinity)
const shape = SHAPES[edict.shape] || SHAPES.balanced
const tier = edict.difficulty

let compTeams = shape.teamsPerDivision[tier]
let logicTeams = shape.teamsPerDivision[tier]
if (edict.emphasis === 'computation') { compTeams++; logicTeams = Math.max(1, logicTeams - 1) }
if (edict.emphasis === 'logic') { logicTeams++; compTeams = Math.max(1, compTeams - 1) }
compTeams = Math.min(compTeams, 4)
logicTeams = Math.min(logicTeams, 4)

let councilors = shape.councilors[tier]

function courtSize(c, l, cn) {
  const chairs = (c > 1 ? 1 : 0) + (l > 1 ? 1 : 0)
  return 2 + chairs + c + l + cn // emperor + adviser + chairs + team leads + councilors
}

// If the budget cannot give every team its minimum runners, shed councilors
// first, then shrink the larger division — never below 1 team per side.
while (CAP - courtSize(compTeams, logicTeams, councilors) < (compTeams + logicTeams) * shape.minRunnersPerTeam) {
  if (councilors > 0) { councilors--; log('Headcount cap: releasing a privy councilor'); continue }
  if (compTeams + logicTeams <= 2) break
  if (compTeams >= logicTeams) compTeams--
  else logicTeams--
  log('Headcount cap: shrinking court to ' + compTeams + ' computation + ' + logicTeams + ' logic teams')
}

const totalTeams = compTeams + logicTeams
const haikuBudget = Math.max(totalTeams, CAP - courtSize(compTeams, logicTeams, councilors))
const runnerQuota = Math.min(shape.maxRunnersPerTeam, Math.max(1, Math.floor(haikuBudget / totalTeams)))
let spareRunners = Math.max(0, Math.min(haikuBudget - runnerQuota * totalTeams, totalTeams))

const plannedSeats = courtSize(compTeams, logicTeams, councilors) + runnerQuota * totalTeams + spareRunners
log('Court for a ' + tier + ' / ' + edict.shape + ' question: ' + compTeams + ' computation + ' +
  logicTeams + ' logic teams, ' + councilors + ' privy councilor(s), ~' + runnerQuota +
  ' Haiku per team — ' + plannedSeats + '/' + CAP + ' seats' +
  (plannedSeats < CAP ? ' (' + (CAP - plannedSeats) + ' seats left unused by design)' : ''))

const TEAMS = []
for (let n = 1; n <= compTeams; n++) TEAMS.push({ division: 'computation', n: n, mandate: edict.computation_mandate })
for (let n = 1; n <= logicTeams; n++) TEAMS.push({ division: 'logic', n: n, mandate: edict.logic_mandate })
for (const t of TEAMS) {
  t.quota = runnerQuota + (spareRunners > 0 ? 1 : 0)
  if (spareRunners > 0) spareRunners--
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    angle: { type: 'string', description: 'This team’s distinct investigative angle (must differ from sibling teams)' },
    pieces: {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      items: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Exact retrieval instruction for a Haiku runner' },
          runners: { type: 'integer', minimum: 1, maximum: 3, description: 'How many Haiku runners to send for this piece' },
        },
        required: ['query', 'runners'],
      },
    },
  },
  required: ['angle', 'pieces'],
}

const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    findings: { type: 'string', description: 'What the raw data showed, including where runners disagreed' },
    answer: { type: 'string', description: 'The team’s answer to its mandate' },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    evidence_gaps: { type: 'string', description: 'What could not be verified from the gathered data' },
  },
  required: ['findings', 'answer', 'confidence'],
}

// ── Phases 2-4, pipelined per team: plan → Haiku fetch → synthesize ────
const reports = await pipeline(
  TEAMS,

  // Phase 2: Sonnet plans its data pieces within its runner quota
  function (t) {
    return agent(
      'You are Sonnet team ' + t.division + '-' + t.n + ', one of ' +
      (t.division === 'computation' ? compTeams : logicTeams) + ' independent team(s) in the ' +
      t.division.toUpperCase() + ' division of a research court shaped for ' + edict.shape + ' work.\n' +
      'Mandate from the Emperor: ' + t.mandate + '\n' +
      'Shared context: ' + edict.shared_context + '\n\n' +
      'You command AT MOST ' + t.quota + ' Haiku runner(s) in total — plans exceeding the quota are ' +
      'trimmed from the last piece backward. Break the mandate into discrete data pieces and for ' +
      'each write an EXACT retrieval instruction (runners fetch raw content only — they never ' +
      'summarize). Use 2-3 runners on a piece only where cross-checking matters; 1 runner per piece ' +
      'stretches your quota across more pieces. You are team number ' + t.n + ': choose an ' +
      'investigative angle your sibling teams are unlikely to pick.',
      { label: 'plan:' + t.division + '-' + t.n, phase: 'Team Planning', model: 'sonnet', schema: PLAN_SCHEMA }
    )
  },

  // Phase 3: Haiku runners fetch raw content, trimmed to the team's quota
  async function (plan, t) {
    const thunks = []
    let used = 0
    let trimmed = 0
    for (const piece of plan.pieces) {
      for (let i = 1; i <= piece.runners; i++) {
        if (used >= t.quota) { trimmed++; continue }
        used++
        const runnerId = i
        const q = piece.query
        thunks.push(function () {
          return agent(
            'You are a Haiku data runner. Retrieval task: ' + q + '\n\n' +
            'Search the web and any available sources. Return the RAW content you find — verbatim ' +
            'quotes, numbers, excerpts, table rows, URLs. Do NOT summarize, do NOT interpret, do NOT ' +
            'conclude. If sources disagree, return both versions verbatim. You are runner ' + runnerId +
            ' for this piece — try a search route a sibling runner might not take.',
            { label: 'fetch:' + t.division + '-' + t.n + ':r' + runnerId, phase: 'Data Gathering', model: 'haiku', effort: 'low' }
          ).then(function (content) { return { query: q, runner: runnerId, content: content } })
        })
      }
    }
    if (trimmed > 0) log('Team ' + t.division + '-' + t.n + ' planned ' + (used + trimmed) +
      ' runners; trimmed ' + trimmed + ' to stay within its quota of ' + t.quota)
    const fetched = await parallel(thunks)
    return { plan: plan, data: fetched.filter(Boolean) }
  },

  // Phase 4: the same team's Sonnet synthesizes its report from the raw data
  function (bundle, t) {
    return agent(
      'You are Sonnet team ' + t.division + '-' + t.n + '. Your investigative angle: ' + bundle.plan.angle + '\n' +
      'Mandate: ' + t.mandate + '\n\n' +
      'Raw data returned by your Haiku runners (unfiltered, unsummarized):\n' +
      JSON.stringify(bundle.data) + '\n\n' +
      'Write your team report answering the mandate. Ground every claim in the raw data, note where ' +
      'runners returned conflicting content, and be explicit about gaps.',
      { label: 'report:' + t.division + '-' + t.n, phase: 'Team Synthesis', model: 'sonnet', schema: REPORT_SCHEMA }
    ).then(function (r) { return { team: t.division + '-' + t.n, division: t.division, report: r } })
  }
)

const teamReports = reports.filter(Boolean)
log(teamReports.length + '/' + totalTeams + ' team reports completed')

// ── Phase 5: divisions with 2+ teams convene a comparison circle ────────
phase('Court Comparison')

const COMPARE_SCHEMA = {
  type: 'object',
  properties: {
    consensus: { type: 'string', description: 'What all teams agree on' },
    discrepancies: { type: 'string', description: 'Where the reports conflict and why' },
    most_accurate_team: { type: 'string', description: 'Which team’s report is most accurate, and the grounds for that judgment' },
    merged_answer: { type: 'string', description: 'The division’s combined best answer to its mandate' },
  },
  required: ['consensus', 'discrepancies', 'most_accurate_team', 'merged_answer'],
}

const divisionResults = await parallel(['computation', 'logic'].map(function (d) {
  return function () {
    const rs = teamReports.filter(function (r) { return r.division === d })
    if (rs.length === 0) return Promise.resolve(null)
    if (rs.length === 1) {
      log('Division ' + d + ' fielded a single team — skipping its circle')
      return Promise.resolve({
        division: d,
        comparison: {
          consensus: '(single team — no cross-team comparison performed)',
          discrepancies: 'n/a',
          most_accurate_team: rs[0].team,
          merged_answer: rs[0].report.answer,
        },
      })
    }
    return agent(
      'You chair the ' + d.toUpperCase() + ' division circle of a research court. ' + rs.length +
      ' independent teams researched the SAME mandate. Their reports:\n' + JSON.stringify(rs) + '\n\n' +
      'Compare them: where do they agree, where do they conflict, which report is most accurate ' +
      '(judge by evidence quality, not confidence wording), and produce the division’s merged answer.',
      { label: 'circle:' + d, model: 'sonnet', schema: COMPARE_SCHEMA }
    ).then(function (c) { return { division: d, comparison: c } })
  }
}))

const circles = divisionResults.filter(Boolean)

// ── Phase 6: privy councilors (analysis-heavy work only) ────────────────
// Extra Opus minds at the top: each critiques the court's evidence
// independently from a distinct angle before the Emperor rules.
let councilOpinions = []
if (councilors > 0) {
  phase('Privy Council')
  const ANGLES = [
    'steelman the strongest objection to the emerging conclusion',
    'stress-test every quantitative claim and derivation',
    'hunt for alternative explanations the teams did not consider',
  ]
  councilOpinions = (await parallel(Array.from({ length: councilors }, function (_, i) {
    return function () {
      return agent(
        'You are Privy Councilor ' + (i + 1) + ' (Opus) in a research court. Your assigned critical ' +
        'angle: ' + ANGLES[i % ANGLES.length] + '.\n' +
        'Original question: ' + question + '\n' +
        'Division circle results:\n' + JSON.stringify(circles) + '\n' +
        'Team reports:\n' + JSON.stringify(teamReports) + '\n\n' +
        'Write an independent analysis from your angle. You advise; you do not decide — the Emperor ' +
        'rules. Be substantive and specific.',
        { label: 'councilor:' + (i + 1), phase: 'Privy Council', model: 'opus' }
      ).then(function (op) { return { councilor: i + 1, angle: ANGLES[i % ANGLES.length], opinion: op } })
    }
  }))).filter(Boolean)
}

// ── Phase 7: the Emperor analyzes ───────────────────────────────────────
phase('Imperial Analysis')

const analysis = await agent(
  'You are the Emperor (Opus). You issued the mandates; your court has reported back.\n' +
  'Original research question: ' + question + '\n\n' +
  'Division circle results:\n' + JSON.stringify(circles) + '\n\n' +
  (councilOpinions.length > 0
    ? 'Privy Council opinions (independent Opus critiques — weigh them, you are not bound by them):\n' +
      JSON.stringify(councilOpinions) + '\n\n'
    : '') +
  'Individual team reports, for reference:\n' + JSON.stringify(teamReports) + '\n\n' +
  'Produce the final imperial analysis: reconcile the computation and logic divisions' +
  (councilOpinions.length > 0 ? ', answer the Council’s strongest objections' : '') +
  ', state the answer to the original question, and note remaining uncertainty honestly. Where a ' +
  'division fielded only one team, weigh its uncorroborated report accordingly.',
  { label: 'emperor:analysis', model: 'opus' }
)

// ── Phase 8: the Fable adviser verifies the conclusion — nothing else ──
phase('Adviser Review')

const adviserReview = await agent(
  'You are the Emperor’s adviser (verification only — you do NOT assign work, redo research, or ' +
  'expand scope; task division belongs to the Emperor alone).\n' +
  'Original question: ' + question + '\n' +
  'Emperor’s final analysis:\n' + analysis + '\n\n' +
  'Division evidence the analysis rests on:\n' + JSON.stringify(circles) + '\n' +
  (councilOpinions.length > 0 ? 'Privy Council critiques already raised:\n' + JSON.stringify(councilOpinions) + '\n' : '') + '\n' +
  'Verify: does the conclusion actually follow from the evidence? Flag any overclaim, internal ' +
  'contradiction, or discrepancy the analysis ignored. Return your verdict and, if needed, the ' +
  'specific corrections the Emperor should make.',
  { label: 'adviser:review', model: 'fable', effort: 'high' }
)

return {
  question: question,
  difficulty: tier,
  shape: edict.shape,
  court: {
    cap: CAP,
    computation_teams: compTeams,
    logic_teams: logicTeams,
    privy_councilors: councilors,
    haiku_quota_per_team: runnerQuota,
  },
  edict: edict,
  team_reports: teamReports,
  division_circles: circles,
  privy_council: councilOpinions,
  imperial_analysis: analysis,
  adviser_review: adviserReview,
}
