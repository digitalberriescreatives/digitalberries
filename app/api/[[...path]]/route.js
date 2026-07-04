import { NextResponse } from 'next/server';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' };

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers }); }

export async function GET(request, { params }) {
  const resolved = await params;
  const path = (resolved?.path || []).join('/');

  if (path === '' || path === 'health') {
    return NextResponse.json({ status: 'ok', service: 'fifa-2026', time: new Date().toISOString() }, { headers });
  }

  if (path === 'matches/live') {
    // Live mock scoreboard for MVP
    const now = Date.now();
    const minute = Math.min(90, Math.floor(((now / 1000) % 5400) / 60));
    return NextResponse.json({
      match: {
        id: 'wc26-001',
        stage: 'Group A · Matchday 1',
        stadium: 'Estadio Azteca, Mexico City',
        attendance: 87423,
        weather: 'Clear · 22°C',
        minute,
        added: 2,
        home: { code: 'BRA', name: 'Brazil', color: '#facc15', score: minute > 34 ? 2 : minute > 12 ? 1 : 0 },
        away: { code: 'ARG', name: 'Argentina', color: '#60a5fa', score: minute > 62 ? 1 : 0 },
        possession: { home: 54, away: 46 },
        xg: { home: 1.87, away: 1.24 },
        shots: { home: 12, away: 9 },
        onTarget: { home: 6, away: 4 },
        corners: { home: 5, away: 3 },
        fouls: { home: 8, away: 11 },
        momentum: Array.from({ length: 24 }, (_, i) => ({ t: i * 4, home: Math.sin(i / 2) * 40 + Math.random() * 20, away: Math.cos(i / 2.4) * 30 + Math.random() * 20 })),
        events: [
          { t: 12, type: 'goal', team: 'home', player: 'Vinicius Jr.', detail: 'Left-foot finish' },
          { t: 34, type: 'goal', team: 'home', player: 'Rodrygo', detail: 'Header from corner' },
          { t: 41, type: 'yellow', team: 'away', player: 'De Paul', detail: 'Tactical foul' },
          { t: 62, type: 'goal', team: 'away', player: 'L. Messi', detail: 'Free-kick top corner' },
          { t: 71, type: 'sub', team: 'home', player: 'Endrick', detail: 'On for Rodrygo' },
          { t: 78, type: 'var', team: 'away', player: 'VAR Check', detail: 'Penalty overturned' },
        ],
        prediction: { homeWin: 46, draw: 22, awayWin: 32 },
      },
    }, { headers });
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
