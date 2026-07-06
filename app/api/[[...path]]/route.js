import { NextResponse } from 'next/server';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' };

// ---------- WC 2026 rich dataset ----------
const T = {
  ARG: { name: 'Argentina', flag: '🇦🇷', color: '#60a5fa' },
  BRA: { name: 'Brazil', flag: '🇧🇷', color: '#facc15' },
  FRA: { name: 'France', flag: '🇫🇷', color: '#3b82f6' },
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#e5e7eb' },
  ESP: { name: 'Spain', flag: '🇪🇸', color: '#dc2626' },
  POR: { name: 'Portugal', flag: '🇵🇹', color: '#22c55e' },
  GER: { name: 'Germany', flag: '🇩🇪', color: '#f59e0b' },
  NED: { name: 'Netherlands', flag: '🇳🇱', color: '#f97316' },
  BEL: { name: 'Belgium', flag: '🇧🇪', color: '#eab308' },
  ITA: { name: 'Italy', flag: '🇮🇹', color: '#3b82f6' },
  CRO: { name: 'Croatia', flag: '🇭🇷', color: '#ef4444' },
  URU: { name: 'Uruguay', flag: '🇺🇾', color: '#93c5fd' },
  MEX: { name: 'Mexico', flag: '🇲🇽', color: '#16a34a' },
  USA: { name: 'USA', flag: '🇺🇸', color: '#60a5fa' },
  CAN: { name: 'Canada', flag: '🇨🇦', color: '#dc2626' },
  JPN: { name: 'Japan', flag: '🇯🇵', color: '#e11d48' },
  KOR: { name: 'South Korea', flag: '🇰🇷', color: '#ef4444' },
  AUS: { name: 'Australia', flag: '🇦🇺', color: '#fde047' },
  MAR: { name: 'Morocco', flag: '🇲🇦', color: '#dc2626' },
  SEN: { name: 'Senegal', flag: '🇸🇳', color: '#22c55e' },
  NGA: { name: 'Nigeria', flag: '🇳🇬', color: '#16a34a' },
  EGY: { name: 'Egypt', flag: '🇪🇬', color: '#dc2626' },
  GHA: { name: 'Ghana', flag: '🇬🇭', color: '#facc15' },
  CIV: { name: 'Ivory Coast', flag: '🇨🇮', color: '#f97316' },
  SUI: { name: 'Switzerland', flag: '🇨🇭', color: '#dc2626' },
  DEN: { name: 'Denmark', flag: '🇩🇰', color: '#dc2626' },
  SWE: { name: 'Sweden', flag: '🇸🇪', color: '#facc15' },
  NOR: { name: 'Norway', flag: '🇳🇴', color: '#3b82f6' },
  POL: { name: 'Poland', flag: '🇵🇱', color: '#f43f5e' },
  TUR: { name: 'Turkey', flag: '🇹🇷', color: '#dc2626' },
  AUT: { name: 'Austria', flag: '🇦🇹', color: '#e5e7eb' },
  SRB: { name: 'Serbia', flag: '🇷🇸', color: '#dc2626' },
  UKR: { name: 'Ukraine', flag: '🇺🇦', color: '#facc15' },
  CZE: { name: 'Czechia', flag: '🇨🇿', color: '#3b82f6' },
  COL: { name: 'Colombia', flag: '🇨🇴', color: '#facc15' },
  CHI: { name: 'Chile', flag: '🇨🇱', color: '#3b82f6' },
  ECU: { name: 'Ecuador', flag: '🇪🇨', color: '#facc15' },
  PER: { name: 'Peru', flag: '🇵🇪', color: '#ef4444' },
  PAR: { name: 'Paraguay', flag: '🇵🇾', color: '#dc2626' },
  VEN: { name: 'Venezuela', flag: '🇻🇪', color: '#eab308' },
  CRC: { name: 'Costa Rica', flag: '🇨🇷', color: '#dc2626' },
  PAN: { name: 'Panama', flag: '🇵🇦', color: '#3b82f6' },
  KSA: { name: 'Saudi Arabia', flag: '🇸🇦', color: '#16a34a' },
  IRN: { name: 'Iran', flag: '🇮🇷', color: '#22c55e' },
  QAT: { name: 'Qatar', flag: '🇶🇦', color: '#7c1d3f' },
  UAE: { name: 'UAE', flag: '🇦🇪', color: '#16a34a' },
  NZL: { name: 'New Zealand', flag: '🇳🇿', color: '#e5e7eb' },
  ALG: { name: 'Algeria', flag: '🇩🇿', color: '#22c55e' },
};

const STADIUMS = [
  'Estadio Azteca, Mexico City',
  'MetLife Stadium, New Jersey',
  'SoFi Stadium, Los Angeles',
  'AT&T Stadium, Dallas',
  'Mercedes-Benz Stadium, Atlanta',
  'Lincoln Financial Field, Philadelphia',
  'Arrowhead Stadium, Kansas City',
  'Levi\u2019s Stadium, San Francisco',
  'Hard Rock Stadium, Miami',
  'BMO Field, Toronto',
  'BC Place, Vancouver',
  'Estadio Akron, Guadalajara',
  'Estadio BBVA, Monterrey',
  'Gillette Stadium, Boston',
  'NRG Stadium, Houston',
  'Lumen Field, Seattle',
];

const GOALSCORERS_HOME = ['L. Messi', 'Di Maria', 'Alvarez', 'Lautaro', 'Mac Allister', 'Enzo', 'Vinicius Jr.', 'Rodrygo', 'Endrick', 'Neymar', 'Raphinha', 'Mbappe', 'Griezmann', 'Dembele', 'Kolo Muani', 'Bellingham', 'H. Kane', 'Foden', 'Saka', 'Rashford', 'Yamal', 'Pedri', 'Gavi', 'Morata', 'Nico Williams', 'R. Lewandowski', 'Musiala', 'Wirtz', 'Havertz', 'Kroos'];
const GOALSCORERS_AWAY = ['C. Ronaldo', 'B. Fernandes', 'Leao', 'Ruben Dias', 'De Bruyne', 'Lukaku', 'Doku', 'Kvaratskhelia', 'Osimhen', 'Salah', 'Mohamed', 'Modric', 'Kramaric', 'Perisic', 'Son', 'H. Choi', 'Kubo', 'Mitoma', 'Ito', 'Hakimi', 'Ziyech', 'En-Nesyri', 'Sane', 'Kimmich', 'Musiala', 'De Jong', 'Depay', 'Xavi Simons', 'Frimpong', 'Van Dijk'];

function pseudoRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function pick(arr, seed) { return arr[Math.floor(pseudoRandom(seed) * arr.length)]; }

function buildEvents(seed, homeScore, awayScore, minuteCap) {
  const events = [];
  for (let i = 0; i < homeScore; i++) {
    events.push({
      t: Math.min(minuteCap - 1, Math.floor(pseudoRandom(seed + i * 3.7) * minuteCap) + 3),
      type: 'goal', team: 'home',
      player: pick(GOALSCORERS_HOME, seed + i),
      detail: pick(['Left-foot finish', 'Header from cross', 'Volley from edge of box', 'Tap-in after cutback', 'Free-kick top corner', 'Penalty converted', 'Long-range strike'], seed + i * 1.1),
    });
  }
  for (let i = 0; i < awayScore; i++) {
    events.push({
      t: Math.min(minuteCap - 1, Math.floor(pseudoRandom(seed + 100 + i * 4.3) * minuteCap) + 3),
      type: 'goal', team: 'away',
      player: pick(GOALSCORERS_AWAY, seed + 200 + i),
      detail: pick(['Right-foot finish', 'Header from corner', 'Counter-attack finish', 'Rebound tap-in', 'Curling effort', 'Chip over keeper'], seed + i * 1.4),
    });
  }
  // Cards
  const cards = Math.floor(pseudoRandom(seed + 33) * 4);
  for (let i = 0; i < cards; i++) {
    events.push({
      t: Math.min(minuteCap - 1, Math.floor(pseudoRandom(seed + 500 + i) * minuteCap) + 5),
      type: 'yellow', team: pseudoRandom(seed + 700 + i) > 0.5 ? 'home' : 'away',
      player: pick(GOALSCORERS_HOME, seed + i * 2),
      detail: 'Tactical foul',
    });
  }
  return events.sort((a, b) => a.t - b.t);
}

function buildMatch({ id, home, away, stage, group, offsetMin, stadium, seed }) {
  const now = Date.now();
  const kickoffAt = now + offsetMin * 60000;
  let status, minute = 0, added = 0, homeScore = 0, awayScore = 0, minuteCap = 90;

  if (offsetMin > 0) {
    status = 'UPCOMING';
    homeScore = 0;
    awayScore = 0;
  } else if (offsetMin > -95) {
    status = 'LIVE';
    minute = Math.min(90, Math.max(1, -offsetMin));
    if (minute > 90) added = Math.min(6, minute - 90);
    minuteCap = minute;
    // Progressive scores based on seed
    homeScore = Math.floor(pseudoRandom(seed) * 3.4);
    awayScore = Math.floor(pseudoRandom(seed + 0.1) * 2.9);
    // Attenuate by minute
    homeScore = Math.min(homeScore, Math.floor(minute / 22));
    awayScore = Math.min(awayScore, Math.floor(minute / 24));
  } else {
    status = 'FINISHED';
    homeScore = Math.floor(pseudoRandom(seed) * 4);
    awayScore = Math.floor(pseudoRandom(seed + 0.2) * 3.5);
    minute = 90;
    added = Math.floor(pseudoRandom(seed + 0.5) * 6);
  }

  const totalMinuteCap = status === 'FINISHED' ? 90 : (status === 'LIVE' ? minute : 90);
  const events = (status === 'UPCOMING') ? [] : buildEvents(seed, homeScore, awayScore, totalMinuteCap);

  const poss = 40 + Math.floor(pseudoRandom(seed + 0.7) * 20);
  return {
    id, home, away, stage, group,
    status, minute, added, kickoffAt,
    homeScore, awayScore,
    stadium,
    possession: { home: poss, away: 100 - poss },
    xg: {
      home: +(pseudoRandom(seed + 0.9) * 3).toFixed(2),
      away: +(pseudoRandom(seed + 1.1) * 2.5).toFixed(2),
    },
    shots: {
      home: Math.floor(pseudoRandom(seed + 1.3) * 14) + 3,
      away: Math.floor(pseudoRandom(seed + 1.5) * 12) + 2,
    },
    onTarget: {
      home: Math.floor(pseudoRandom(seed + 1.7) * 7) + 1,
      away: Math.floor(pseudoRandom(seed + 1.9) * 6) + 1,
    },
    corners: {
      home: Math.floor(pseudoRandom(seed + 2.1) * 8),
      away: Math.floor(pseudoRandom(seed + 2.3) * 7),
    },
    fouls: {
      home: Math.floor(pseudoRandom(seed + 2.5) * 12) + 3,
      away: Math.floor(pseudoRandom(seed + 2.7) * 12) + 3,
    },
    prediction: (() => {
      const h = 30 + Math.floor(pseudoRandom(seed + 3) * 40);
      const d = Math.min(40, 100 - h - Math.floor(pseudoRandom(seed + 3.1) * 30));
      const a = 100 - h - d;
      return { homeWin: h, draw: d, awayWin: a };
    })(),
    momentum: Array.from({ length: 20 }, (_, i) => ({
      t: i * 5,
      home: Math.sin((seed + i) / 2) * 35 + pseudoRandom(seed + i) * 20,
      away: Math.cos((seed + i) / 2.4) * 30 + pseudoRandom(seed + i + 0.5) * 20,
    })),
    events,
  };
}

// Fixture definition: minutes relative to now
// Positive => future kickoff (upcoming). 0..-95 => live. <-95 => finished (past match)
const FIXTURES = [
  // ---- LIVE (currently playing simultaneously in the demo world) ----
  { id: 'wc26-101', home: 'ARG', away: 'CRO', stage: 'Quarterfinal', group: null, offsetMin: -34, sIdx: 0, seed: 3.1 },
  { id: 'wc26-102', home: 'BRA', away: 'NED', stage: 'Quarterfinal', group: null, offsetMin: -58, sIdx: 1, seed: 3.2 },
  { id: 'wc26-103', home: 'ESP', away: 'GER', stage: 'Quarterfinal', group: null, offsetMin: -12, sIdx: 2, seed: 3.3 },
  { id: 'wc26-104', home: 'FRA', away: 'POR', stage: 'Quarterfinal', group: null, offsetMin: -76, sIdx: 3, seed: 3.4 },
  { id: 'wc26-105', home: 'ENG', away: 'MAR', stage: 'Round of 16', group: null, offsetMin: -22, sIdx: 4, seed: 3.5 },
  { id: 'wc26-106', home: 'BEL', away: 'JPN', stage: 'Round of 16', group: null, offsetMin: -47, sIdx: 5, seed: 3.6 },

  // ---- UPCOMING ----
  { id: 'wc26-201', home: 'ITA', away: 'URU', stage: 'Quarterfinal', group: null, offsetMin: 65, sIdx: 6, seed: 4.1 },
  { id: 'wc26-202', home: 'MEX', away: 'USA', stage: 'Quarterfinal', group: null, offsetMin: 240, sIdx: 7, seed: 4.2 },
  { id: 'wc26-203', home: 'COL', away: 'KOR', stage: 'Round of 16', group: null, offsetMin: 400, sIdx: 8, seed: 4.3 },
  { id: 'wc26-204', home: 'DEN', away: 'SEN', stage: 'Round of 16', group: null, offsetMin: 620, sIdx: 9, seed: 4.4 },
  { id: 'wc26-205', home: 'SUI', away: 'NGA', stage: 'Round of 16', group: null, offsetMin: 1440, sIdx: 10, seed: 4.5 },
  { id: 'wc26-206', home: 'POL', away: 'AUS', stage: 'Round of 16', group: null, offsetMin: 1660, sIdx: 11, seed: 4.6 },
  { id: 'wc26-207', home: 'CRO', away: 'SUI', stage: 'Semifinal', group: null, offsetMin: 2880, sIdx: 12, seed: 4.7 },
  { id: 'wc26-208', home: 'ARG', away: 'BRA', stage: 'Semifinal', group: null, offsetMin: 3120, sIdx: 13, seed: 4.8 },

  // ---- FINISHED (group stage results) ----
  { id: 'wc26-g001', home: 'ARG', away: 'KSA', stage: 'Group C', group: 'C', offsetMin: -14400, sIdx: 0, seed: 5.11 },
  { id: 'wc26-g002', home: 'MEX', away: 'POL', stage: 'Group A', group: 'A', offsetMin: -14380, sIdx: 11, seed: 5.12 },
  { id: 'wc26-g003', home: 'FRA', away: 'AUS', stage: 'Group D', group: 'D', offsetMin: -14360, sIdx: 2, seed: 5.13 },
  { id: 'wc26-g004', home: 'ENG', away: 'IRN', stage: 'Group B', group: 'B', offsetMin: -14340, sIdx: 3, seed: 5.14 },
  { id: 'wc26-g005', home: 'ESP', away: 'CRC', stage: 'Group E', group: 'E', offsetMin: -14320, sIdx: 4, seed: 5.15 },
  { id: 'wc26-g006', home: 'GER', away: 'JPN', stage: 'Group E', group: 'E', offsetMin: -14300, sIdx: 5, seed: 5.16 },
  { id: 'wc26-g007', home: 'BEL', away: 'CAN', stage: 'Group F', group: 'F', offsetMin: -14280, sIdx: 6, seed: 5.17 },
  { id: 'wc26-g008', home: 'CRO', away: 'MAR', stage: 'Group F', group: 'F', offsetMin: -14260, sIdx: 7, seed: 5.18 },
  { id: 'wc26-g009', home: 'BRA', away: 'SRB', stage: 'Group G', group: 'G', offsetMin: -14240, sIdx: 8, seed: 5.19 },
  { id: 'wc26-g010', home: 'POR', away: 'GHA', stage: 'Group H', group: 'H', offsetMin: -14220, sIdx: 9, seed: 5.2 },
  { id: 'wc26-g011', home: 'URU', away: 'KOR', stage: 'Group H', group: 'H', offsetMin: -14200, sIdx: 10, seed: 5.21 },
  { id: 'wc26-g012', home: 'SUI', away: 'CMR', stage: 'Group G', group: 'G', offsetMin: -14180, sIdx: 12, seed: 5.22 },
  { id: 'wc26-g013', home: 'NED', away: 'SEN', stage: 'Group A', group: 'A', offsetMin: -14160, sIdx: 13, seed: 5.23 },
  { id: 'wc26-g014', home: 'USA', away: 'WAL', stage: 'Group B', group: 'B', offsetMin: -14140, sIdx: 14, seed: 5.24 },
  { id: 'wc26-g015', home: 'DEN', away: 'TUN', stage: 'Group D', group: 'D', offsetMin: -14120, sIdx: 15, seed: 5.25 },
  { id: 'wc26-g016', home: 'ITA', away: 'ECU', stage: 'Group C', group: 'C', offsetMin: -14100, sIdx: 0, seed: 5.26 },

  // Round of 16 finished
  { id: 'wc26-r001', home: 'ARG', away: 'AUS', stage: 'Round of 16', group: null, offsetMin: -5760, sIdx: 1, seed: 6.11 },
  { id: 'wc26-r002', home: 'FRA', away: 'POL', stage: 'Round of 16', group: null, offsetMin: -5700, sIdx: 3, seed: 6.12 },
  { id: 'wc26-r003', home: 'ENG', away: 'SEN', stage: 'Round of 16', group: null, offsetMin: -4320, sIdx: 5, seed: 6.13 },
  { id: 'wc26-r004', home: 'NED', away: 'MEX', stage: 'Round of 16', group: null, offsetMin: -4260, sIdx: 7, seed: 6.14 },
  { id: 'wc26-r005', home: 'BRA', away: 'KOR', stage: 'Round of 16', group: null, offsetMin: -2880, sIdx: 9, seed: 6.15 },
  { id: 'wc26-r006', home: 'POR', away: 'SUI', stage: 'Round of 16', group: null, offsetMin: -2820, sIdx: 11, seed: 6.16 },
  { id: 'wc26-r007', home: 'ESP', away: 'MAR', stage: 'Round of 16', group: null, offsetMin: -1440, sIdx: 13, seed: 6.17 },
  { id: 'wc26-r008', home: 'GER', away: 'CRO', stage: 'Round of 16', group: null, offsetMin: -1380, sIdx: 15, seed: 6.18 },
];

const ALL_MATCHES = FIXTURES.map((f) =>
  buildMatch({
    id: f.id,
    home: f.home,
    away: f.away,
    stage: f.stage,
    group: f.group,
    offsetMin: f.offsetMin,
    stadium: STADIUMS[f.sIdx % STADIUMS.length],
    seed: f.seed,
  })
);

// Extra teams that may not be in main map — ensure fallback
function enrichTeam(code) {
  if (T[code]) return { code, ...T[code] };
  const fallback = { WAL: { name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', color: '#dc2626' }, TUN: { name: 'Tunisia', flag: '🇹🇳', color: '#dc2626' }, CMR: { name: 'Cameroon', flag: '🇨🇲', color: '#16a34a' } };
  return { code, ...(fallback[code] || { name: code, flag: '⚽', color: '#94a3b8' }) };
}

function serializeMatch(m) {
  return {
    ...m,
    home: enrichTeam(m.home),
    away: enrichTeam(m.away),
  };
}

// ---------- ROUTE HANDLERS ----------
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers }); }

export async function GET(request, { params }) {
  const resolved = await params;
  const path = (resolved?.path || []).join('/');

  if (path === '' || path === 'health') {
    return NextResponse.json({ status: 'ok', service: 'fifa-2026', time: new Date().toISOString() }, { headers });
  }

  if (path === 'matches' || path === 'matches/all') {
    const enriched = ALL_MATCHES.map(serializeMatch);
    const counts = {
      total: enriched.length,
      live: enriched.filter((m) => m.status === 'LIVE').length,
      upcoming: enriched.filter((m) => m.status === 'UPCOMING').length,
      finished: enriched.filter((m) => m.status === 'FINISHED').length,
    };
    return NextResponse.json({ matches: enriched, counts }, { headers });
  }

  if (path.startsWith('matches/id/')) {
    const id = path.split('/').pop();
    const m = ALL_MATCHES.find((x) => x.id === id);
    if (!m) return NextResponse.json({ error: 'not found' }, { status: 404, headers });
    return NextResponse.json({ match: serializeMatch(m) }, { headers });
  }

  if (path === 'matches/live') {
    // Backward compat: pick the most interesting live match
    const live = ALL_MATCHES.filter((m) => m.status === 'LIVE');
    const chosen = live[0] || ALL_MATCHES[0];
    return NextResponse.json({ match: serializeMatch(chosen) }, { headers });
  }

  return NextResponse.json({ error: 'not found', path }, { status: 404, headers });
}

export async function POST(request, { params }) {
  const resolved = await params;
  const path = (resolved?.path || []).join('/');
  const body = await request.json().catch(() => ({}));
  if (path === 'fantasy/predict') {
    return NextResponse.json({ ok: true, echo: body, projection: (Math.random() * 40 + 60).toFixed(1) }, { headers });
  }
  return NextResponse.json({ ok: true, path, body }, { headers });
}
