export const meta = {
  name: 'imperial-research',
  description: 'Opus emperor sizes his court to the question (1-3 Sonnet teams per division, Haiku runners under each), hard-capped at 20 members; Fable adviser verifies the final analysis',
  whenToUse: 'Deep research on a single question where independent teams must converge and accuracy is judged by cross-team comparison; court size scales with question difficulty',
  phases: [
    { title: 'Imperial Edict', detail: 'Opus judges question difficulty, sizes the court, and issues computation and logic mandates', model: 'opus' },
    { title: 'Team Planning', detail: 'each Sonnet team splits its mandate into data pieces within its Haiku quota', model: 'sonnet' },
    { title: 'Data Gathering', detail: 'Haiku runners fetch raw content only, no summarizing', model: 'haiku' },
    { title: 'Team Synthesis', detail: 'each Sonnet team writes its report from the raw data', model: 'sonnet' },
    { title: 'Court Comparison', detail: 'divisions with 2+ teams convene a circle to compare reports for accuracy', model: 'sonnet' },
    { title: 'Imperial Analysis', detail: 'Opus analyzes both divisions and issues the final answer', model: 'opus' },
    { title: 'Adviser Review', detail: 'Fable adviser verifies the conclusion only — no task assignment', model: 'fable' },
  ],
}

const question = typeof args === 'string' ? args : (args && args.question)
if (!question) {
  throw new Error('Pass the research question via args, e.g. Workflow({name: "imperial-research", args: "..."})')
}

// Hard cap on court size (seats, i.e. distinct members — a member may speak
// more than once). Callers may lower it via args.max_agents but never raise it.
const requestedCap = (args && args.max_agents) || 20
const MAX_COURT = Math.min(20, Math.max(6, requestedCap))

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, Math.round(x || lo))) }

// ── Phase 1: the Emperor judges difficulty and sizes the court ─────────
phase('Imperial Edict')

const EDICT_SCHEMA = {
  type: 'object',
  properties: {
    difficulty: { type: 'string', enum: ['simple', 'moderate', 'complex'], description: 'Your judgment of the question' },
    computation_teams: { type: 'integer', minimum: 1, maximum: 3, description: 'Sonnet teams for the computation division' },
    logic_teams: { type: 'integer', minimum: 1, maximum: 3, description: 'Sonnet teams for the logic division' },
    computation_mandate: { type: 'string', description: 'What the COMPUTATION division must establish: numbers, quantitative checks, data-driven verification' },
    logic_mandate: { type: 'string', description: 'What the LOGIC division must establish: arguments, internal consistency, qualitative reasoning' },
    shared_context: { type: 'string', description: 'Background every team needs before starting' },
  },
  required: ['difficulty', 'computation_teams', 'logic_teams', 'computation_mandate', 'logic_mandate', 'shared_context'],
}

const edict = await agent(
  'You are the Emperor (Opus), supreme orchestrator of a research court with a STRICT headcount ' +
  'cap of ' + MAX_COURT + ' members total (you, your adviser, Sonnet team leads, circle chairs, and ' +
  'Haiku data runners all count).\n' +
  'Research question: ' + question + '\n\n' +
  'First judge the question’s difficulty and size your court accordingly:\n' +
  '- simple (single factual thread): 1 team per division — leaves ~3-4 Haiku runners per team\n' +
  '- moderate (a few contested threads): 2 teams per division — leaves ~2-3 runners per team\n' +
  '- complex (many contested threads, needs triangulation): 3 teams per division — runners get ' +
  'thin (~1-2 per team), so choose this only when independent triangulation matters more than ' +
  'retrieval breadth.\n' +
  'The two divisions may differ in size if the question is lopsided (e.g. heavily quantitative).\n\n' +
  'Then issue two mandates for the SAME question: one for the COMPUTATION division (quantitative: ' +
  'numbers, calculations, measurable evidence) and one for the LOGIC division (qualitative: ' +
  'argument structure, consistency, reasoning). Do NOT answer the question yourself — only size ' +
  'the court and issue the mandates.',
  { label: 'emperor:edict', model: 'opus', schema: EDICT_SCHEMA }
)

// ── Enforce the headcount cap deterministically ─────────────────────────
let compTeams = clamp(edict.computation_teams, 1, 3)
let logicTeams = clamp(edict.logic_teams, 1, 3)

function courtSize(c, l) {
  const chairs = (c > 1 ? 1 : 0) + (l > 1 ? 1 : 0)
  return 2 + chairs + c + l // emperor + adviser + circle chairs + team leads
}

// Every team must keep at least 2 Haiku runners; shrink the larger division
// until the budget allows it (never below 1 team per division).
while (MAX_COURT - courtSize(compTeams, logicTeams) < (compTeams + logicTeams) * 2 && compTeams + logicTeams > 2) {
  if (compTeams >= logicTeams && compTeams > 1) compTeams--
  else logicTeams--
  log('Headcount cap: shrinking court to ' + compTeams + ' computation + ' + logicTeams + ' logic teams')
}

const totalTeams = compTeams + logicTeams
const haikuBudget = MAX_COURT - courtSize(compTeams, logicTeams)
const runnerQuota = Math.max(1, Math.floor(haikuBudget / totalTeams))
let spareRunners = haikuBudget - runnerQuota * totalTeams // first teams get one extra

log('Court sized for a ' + edict.difficulty + ' question: ' + compTeams + ' computation + ' +
  logicTeams + ' logic teams, ' + haikuBudget + ' Haiku runners total (' +
  courtSize(compTeams, logicTeams) + ' + ' + haikuBudget + ' = ' +
  (courtSize(compTeams, logicTeams) + haikuBudget) + '/' + MAX_COURT + ' seats)')

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
      maxItems: 4,
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
// No barrier between stages: a fast team can be synthesizing while a slow
// team is still gathering.
const reports = await pipeline(
  TEAMS,

  // Phase 2: Sonnet plans its data pieces within its runner quota
  function (t) {
    return agent(
      'You are Sonnet team ' + t.division + '-' + t.n + ', one of ' +
      (t.division === 'computation' ? compTeams : logicTeams) + ' independent team(s) in the ' +
      t.division.toUpperCase() + ' division of a research court.\n' +
      'Mandate from the Emperor: ' + t.mandate + '\n' +
      'Shared context: ' + edict.shared_context + '\n\n' +
      'You command AT MOST ' + t.quota + ' Haiku runner(s) in total — plans exceeding the quota ' +
      'are trimmed from the last piece backward. Break the mandate into discrete data pieces and ' +
      'for each write an EXACT retrieval instruction (runners fetch raw content only — they never ' +
      'summarize). Use 2-3 runners on a piece only where cross-checking matters and the quota allows; ' +
      'otherwise 1 runner per piece stretches your quota across more pieces. You are team number ' +
      t.n + ': choose an investigative angle your sibling teams are unlikely to pick.',
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
// Barrier is correct here: comparison needs ALL of a division's reports.
// A single-team division has nothing to compare — its report passes
// straight to the Emperor, marked as uncompared.
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

// ── Phase 6: the Emperor analyzes ───────────────────────────────────────
phase('Imperial Analysis')

const analysis = await agent(
  'You are the Emperor (Opus). You issued the mandates; your court has reported back.\n' +
  'Original research question: ' + question + '\n\n' +
  'Division circle results (cross-compared within each division where it fielded 2+ teams):\n' +
  JSON.stringify(circles) + '\n\n' +
  'Individual team reports, for reference:\n' + JSON.stringify(teamReports) + '\n\n' +
  'Produce the final imperial analysis: reconcile the computation and logic divisions, state the ' +
  'answer to the original question, and note remaining uncertainty honestly. Where a division ' +
  'fielded only one team, weigh its uncorroborated report accordingly.',
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
  difficulty: edict.difficulty,
  court: {
    cap: MAX_COURT,
    computation_teams: compTeams,
    logic_teams: logicTeams,
    haiku_runners_budgeted: haikuBudget,
  },
  edict: edict,
  team_reports: teamReports,
  division_circles: circles,
  imperial_analysis: analysis,
  adviser_review: adviserReview,
}
