export const meta = {
  name: 'imperial-research',
  description: 'Opus emperor commands 6 Sonnet teams (computation x3, logic x3) with Haiku data runners; Fable adviser verifies the final analysis',
  whenToUse: 'Deep research on a single question where independent teams must converge and accuracy is judged by cross-team comparison',
  phases: [
    { title: 'Imperial Edict', detail: 'Opus divides the question into computation and logic mandates', model: 'opus' },
    { title: 'Team Planning', detail: 'each Sonnet team splits its mandate into data pieces and assigns 2-3 Haiku runners per piece', model: 'sonnet' },
    { title: 'Data Gathering', detail: 'Haiku runners fetch raw content only, no summarizing', model: 'haiku' },
    { title: 'Team Synthesis', detail: 'each Sonnet team writes its report from the raw data', model: 'sonnet' },
    { title: 'Court Comparison', detail: 'Sonnet circle per division compares the 3 team reports for accuracy', model: 'sonnet' },
    { title: 'Imperial Analysis', detail: 'Opus analyzes both divisions and issues the final answer', model: 'opus' },
    { title: 'Adviser Review', detail: 'Fable adviser verifies the conclusion only — no task assignment', model: 'fable' },
  ],
}

const question = typeof args === 'string' ? args : (args && args.question)
if (!question) {
  throw new Error('Pass the research question via args, e.g. Workflow({name: "imperial-research", args: "..."})')
}

// ── Phase 1: the Emperor divides the work ──────────────────────────────
phase('Imperial Edict')

const EDICT_SCHEMA = {
  type: 'object',
  properties: {
    computation_mandate: { type: 'string', description: 'What the COMPUTATION division must establish: numbers, quantitative checks, data-driven verification' },
    logic_mandate: { type: 'string', description: 'What the LOGIC division must establish: arguments, internal consistency, qualitative reasoning' },
    shared_context: { type: 'string', description: 'Background every team needs before starting' },
  },
  required: ['computation_mandate', 'logic_mandate', 'shared_context'],
}

const edict = await agent(
  'You are the Emperor (Opus), supreme orchestrator of a research court.\n' +
  'Research question: ' + question + '\n\n' +
  'Issue two mandates for the SAME question: one for the COMPUTATION division ' +
  '(quantitative: numbers, calculations, measurable evidence) and one for the LOGIC division ' +
  '(qualitative: argument structure, consistency, reasoning). ' +
  'Do NOT answer the question yourself — only issue the mandates and shared context.',
  { label: 'emperor:edict', model: 'opus', schema: EDICT_SCHEMA }
)

log('Imperial edict issued — dispatching 6 Sonnet teams')

const TEAMS = []
for (const n of [1, 2, 3]) TEAMS.push({ division: 'computation', n: n, mandate: edict.computation_mandate })
for (const n of [1, 2, 3]) TEAMS.push({ division: 'logic', n: n, mandate: edict.logic_mandate })

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    angle: { type: 'string', description: 'This team’s distinct investigative angle (must differ from sibling teams)' },
    pieces: {
      type: 'array',
      minItems: 1,
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Exact retrieval instruction for a Haiku runner' },
          runners: { type: 'integer', minimum: 2, maximum: 3, description: 'How many Haiku runners to send for this piece' },
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
// No barrier between stages: a fast team can be synthesizing while a slow
// team is still gathering.
const reports = await pipeline(
  TEAMS,

  // Phase 2: Sonnet plans its data pieces
  function (t) {
    return agent(
      'You are Sonnet team ' + t.division + '-' + t.n + ', one of three independent teams in the ' +
      t.division.toUpperCase() + ' division of a research court.\n' +
      'Mandate from the Emperor: ' + t.mandate + '\n' +
      'Shared context: ' + edict.shared_context + '\n\n' +
      'Break the mandate into 1-4 discrete data pieces. For each piece write an EXACT retrieval ' +
      'instruction for a Haiku runner (runners fetch raw content only — they never summarize) and ' +
      'decide whether the piece needs 2 or 3 runners. You are team number ' + t.n + ': choose an ' +
      'investigative angle your sibling teams are unlikely to pick, so the three teams stay independent.',
      { label: 'plan:' + t.division + '-' + t.n, phase: 'Team Planning', model: 'sonnet', schema: PLAN_SCHEMA }
    )
  },

  // Phase 3: Haiku runners fetch raw content, 2-3 per piece as the Sonnet decided
  async function (plan, t) {
    const thunks = []
    for (const piece of plan.pieces) {
      for (let i = 1; i <= piece.runners; i++) {
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
log(teamReports.length + '/6 team reports completed — convening division circles')

// ── Phase 5: Sonnet circle per division compares its 3 reports ─────────
// Barrier is correct here: comparison needs ALL of a division's reports.
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
    return agent(
      'You chair the ' + d.toUpperCase() + ' division circle of a research court. Three independent ' +
      'teams researched the SAME mandate. Their reports:\n' + JSON.stringify(rs) + '\n\n' +
      'Compare them: where do they agree, where do they conflict, which report is most accurate ' +
      '(judge by evidence quality, not confidence wording), and produce the division’s merged answer.',
      { label: 'circle:' + d, model: 'sonnet', schema: COMPARE_SCHEMA }
    ).then(function (c) { return { division: d, comparison: c } })
  }
}))

const circles = divisionResults.filter(Boolean)

// ── Phase 6: the Emperor analyzes ───────────────────────────────────────
phase('Imperial Analysis')

const analysis = await agent(
  'You are the Emperor (Opus). You issued the mandates; your court has reported back.\n' +
  'Original research question: ' + question + '\n\n' +
  'Division circle results (already cross-compared within each division):\n' +
  JSON.stringify(circles) + '\n\n' +
  'Individual team reports, for reference:\n' + JSON.stringify(teamReports) + '\n\n' +
  'Produce the final imperial analysis: reconcile the computation and logic divisions, state the ' +
  'answer to the original question, and note remaining uncertainty honestly.',
  { label: 'emperor:analysis', model: 'opus' }
)

// ── Phase 7: the Fable adviser verifies the conclusion — nothing else ──
phase('Adviser Review')

const adviserReview = await agent(
  'You are the Emperor’s adviser (verification only — you do NOT assign work, redo research, or ' +
  'expand scope; task division belongs to the Emperor alone).\n' +
  'Original question: ' + question + '\n' +
  'Emperor’s final analysis:\n' + analysis + '\n\n' +
  'Division evidence the analysis rests on:\n' + JSON.stringify(circles) + '\n\n' +
  'Verify: does the conclusion actually follow from the evidence? Flag any overclaim, internal ' +
  'contradiction, or discrepancy the analysis ignored. Return your verdict and, if needed, the ' +
  'specific corrections the Emperor should make.',
  { label: 'adviser:review', model: 'fable', effort: 'high' }
)

return {
  question: question,
  edict: edict,
  team_reports: teamReports,
  division_circles: circles,
  imperial_analysis: analysis,
  adviser_review: adviserReview,
}
