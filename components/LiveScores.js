'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Clock, Trophy, ChevronRight, X, Sparkles, Timer, Users as UsersIcon, Wind, TrendingUp } from 'lucide-react';
import MomentumChart from '@/components/MomentumChart';

const STATUS_TABS = [
  { key: 'LIVE', label: 'Live', color: '#ef4444' },
  { key: 'UPCOMING', label: 'Upcoming', color: '#22d3ee' },
  { key: 'FINISHED', label: 'Finished', color: '#10b981' },
  { key: 'ALL', label: 'All', color: '#a78bfa' },
];

const STAGE_FILTERS = ['All', 'Group', 'Round of 16', 'Quarterfinal', 'Semifinal', 'Final'];

function useMatches() {
  const [data, setData] = useState({ matches: [], counts: null });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/matches', { cache: 'no-store' });
        const j = await r.json();
        if (alive) setData(j);
      } catch (e) {}
    };
    load();
    const i = setInterval(load, 6000);
    return () => { alive = false; clearInterval(i); };
  }, []);
  return data;
}

function formatKickoff(ms) {
  const d = new Date(ms);
  const diff = ms - Date.now();
  const day = Math.floor(diff / 86400000);
  if (day > 0) return `in ${day}d ${Math.floor((diff / 3600000) % 24)}h`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `in ${h}h ${Math.floor((diff / 60000) % 60)}m`;
  const m = Math.floor(diff / 60000);
  if (m > 0) return `in ${m}m`;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MatchCard({ m, onClick }) {
  const live = m.status === 'LIVE';
  const done = m.status === 'FINISHED';
  const up = m.status === 'UPCOMING';

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-4 relative overflow-hidden text-left group cursor-pointer"
    >
      {/* Glow accents */}
      <div
        className="absolute -top-16 -left-16 w-40 h-40 rounded-full blur-3xl opacity-25 group-hover:opacity-50 transition-opacity"
        style={{ background: m.home.color }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-25 group-hover:opacity-50 transition-opacity"
        style={{ background: m.away.color }}
      />

      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {live && (
            <>
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className="pulse-ring" />
                <span className="w-2 h-2 rounded-full bg-red-500" />
              </span>
              <span className="text-[10px] tracking-[0.3em] font-bold text-red-400">
                LIVE · {m.minute}{m.added ? `+${m.added}` : ''}&#39;
              </span>
            </>
          )}
          {up && (
            <>
              <Clock className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] tracking-[0.3em] font-bold text-cyan-300">{formatKickoff(m.kickoffAt).toUpperCase()}</span>
            </>
          )}
          {done && (
            <>
              <Trophy className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] tracking-[0.3em] font-bold text-emerald-300">FT</span>
            </>
          )}
        </div>
        <span className="text-[10px] tracking-widest uppercase text-white/40">{m.stage}</span>
      </div>

      <div className="relative flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <span className="text-3xl leading-none">{m.home.flag}</span>
          <div className="min-w-0">
            <div className="font-display text-xl tracking-widest leading-none" style={{ color: m.home.color }}>{m.home.code}</div>
            <div className="text-[10px] text-white/40 truncate">{m.home.name}</div>
          </div>
        </div>
        {/* Score */}
        <div className="shrink-0 text-center">
          {up ? (
            <div className="font-display text-2xl tracking-widest text-white/40">VS</div>
          ) : (
            <div className="flex items-center gap-1.5">
              <motion.span
                key={`h${m.homeScore}`}
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`font-display text-3xl leading-none ${m.homeScore > m.awayScore ? 'text-white' : 'text-white/50'}`}
              >{m.homeScore}</motion.span>
              <span className="text-white/20 font-display text-2xl">-</span>
              <motion.span
                key={`a${m.awayScore}`}
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`font-display text-3xl leading-none ${m.awayScore > m.homeScore ? 'text-white' : 'text-white/50'}`}
              >{m.awayScore}</motion.span>
            </div>
          )}
        </div>
        {/* Away */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5 justify-end text-right">
          <div className="min-w-0">
            <div className="font-display text-xl tracking-widest leading-none" style={{ color: m.away.color }}>{m.away.code}</div>
            <div className="text-[10px] text-white/40 truncate">{m.away.name}</div>
          </div>
          <span className="text-3xl leading-none">{m.away.flag}</span>
        </div>
      </div>

      {/* Live progress bar for LIVE */}
      {live && (
        <div className="relative mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${Math.min(100, (m.minute / 90) * 100)}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-red-500"
          />
        </div>
      )}

      <div className="relative mt-3 flex items-center justify-between text-[10px] text-white/40">
        <span className="truncate max-w-[70%]">{m.stadium}</span>
        <span className="flex items-center gap-1 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
          Details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.button>
  );
}

function MatchModal({ match, onClose }) {
  if (!match) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl w-full max-w-3xl relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 border-b border-white/10">
            <div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: match.home.color }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: match.away.color }}
            />
            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center z-10">
              <X className="w-4 h-4" />
            </button>

            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {match.status === 'LIVE' && (
                  <>
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="pulse-ring" />
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    </span>
                    <span className="text-[11px] tracking-[0.35em] font-bold text-red-400">LIVE · {match.minute}{match.added ? `+${match.added}` : ''}&#39;</span>
                  </>
                )}
                {match.status === 'UPCOMING' && <span className="text-[11px] tracking-[0.35em] font-bold text-cyan-300">KICKOFF {formatKickoff(match.kickoffAt).toUpperCase()}</span>}
                {match.status === 'FINISHED' && <span className="text-[11px] tracking-[0.35em] font-bold text-emerald-300">FULL-TIME</span>}
                <div className="w-px h-3 bg-white/20 mx-1" />
                <span className="text-[11px] tracking-widest text-white/60 uppercase">{match.stage}</span>
              </div>
              <span className="text-[10px] text-white/40 max-w-[45%] truncate">{match.stadium}</span>
            </div>

            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
              <div className="text-right flex items-center justify-end gap-3">
                <div>
                  <div className="font-display text-4xl sm:text-6xl tracking-tight" style={{ color: match.home.color }}>{match.home.code}</div>
                  <div className="text-white/60 text-xs mt-1">{match.home.name}</div>
                </div>
                <span className="text-5xl sm:text-7xl">{match.home.flag}</span>
              </div>
              <div className="text-center flex items-center gap-3 sm:gap-5">
                {match.status === 'UPCOMING' ? (
                  <div className="font-display text-4xl sm:text-6xl text-white/40">VS</div>
                ) : (
                  <>
                    <div className="font-display text-5xl sm:text-8xl text-white">{match.homeScore}</div>
                    <div className="text-white/30 font-display text-3xl sm:text-6xl">:</div>
                    <div className="font-display text-5xl sm:text-8xl text-white">{match.awayScore}</div>
                  </>
                )}
              </div>
              <div className="text-left flex items-center gap-3">
                <span className="text-5xl sm:text-7xl">{match.away.flag}</span>
                <div>
                  <div className="font-display text-4xl sm:text-6xl tracking-tight" style={{ color: match.away.color }}>{match.away.code}</div>
                  <div className="text-white/60 text-xs mt-1">{match.away.name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Possession */}
            {match.status !== 'UPCOMING' && (
              <div>
                <div className="flex justify-between text-[10px] text-white/50 mb-2 tracking-widest">
                  <span>POSSESSION {match.possession.home}%</span>
                  <span>{match.possession.away}% POSSESSION</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${match.possession.home}%` }} transition={{ duration: 1 }} className="h-full" style={{ background: match.home.color }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${match.possession.away}%` }} transition={{ duration: 1, delay: 0.15 }} className="h-full" style={{ background: match.away.color }} />
                </div>
              </div>
            )}

            {/* Momentum */}
            {match.status !== 'UPCOMING' && (
              <div>
                <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1">Momentum</div>
                <MomentumChart data={match.momentum} />
              </div>
            )}

            {/* Stats */}
            {match.status !== 'UPCOMING' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                {[
                  { label: 'xG', h: match.xg.home, a: match.xg.away },
                  { label: 'Shots', h: match.shots.home, a: match.shots.away },
                  { label: 'On Target', h: match.onTarget.home, a: match.onTarget.away },
                  { label: 'Corners', h: match.corners.home, a: match.corners.away },
                  { label: 'Fouls', h: match.fouls.home, a: match.fouls.away },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                    <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-1">{s.label}</div>
                    <div className="font-mono-alt text-sm text-white">
                      <span style={{ color: match.home.color }}>{s.h}</span>
                      <span className="text-white/30 mx-1.5">/</span>
                      <span style={{ color: match.away.color }}>{s.a}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline */}
            {match.events?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] tracking-[0.3em] text-white/50 uppercase">Timeline</span>
                </div>
                <div className="space-y-2">
                  {match.events.slice().reverse().map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 ${e.team === 'away' ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <span className="text-[10px] font-mono-alt tracking-wider text-white/40 w-10 shrink-0">{e.t}&#39;</span>
                      <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                        e.type === 'goal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        e.type === 'yellow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-white/5 text-white/60 border border-white/10'
                      }`}>{e.type === 'goal' ? '⚽' : e.type === 'yellow' ? '▮' : '⚠'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{e.player}</div>
                        <div className="text-[11px] text-white/40 truncate">{e.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Prediction */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] tracking-[0.3em] text-white/60 uppercase font-semibold">AI Prediction</span>
                <span className="text-[10px] text-white/40 ml-auto">Neural v3.2</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: `${match.home.code} win`, val: match.prediction.homeWin, color: match.home.color },
                  { label: 'Draw', val: match.prediction.draw, color: '#a3a3a3' },
                  { label: `${match.away.code} win`, val: match.prediction.awayWin, color: match.away.color },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/70 font-semibold">{p.label}</span>
                      <span className="font-mono-alt text-white">{p.val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.val}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LiveScores() {
  const { matches, counts } = useMatches();
  const [tab, setTab] = useState('LIVE');
  const [stage, setStage] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = matches || [];
    if (tab !== 'ALL') list = list.filter((m) => m.status === tab);
    if (stage !== 'All') {
      list = list.filter((m) => stage === 'Group' ? m.stage?.startsWith('Group') : m.stage === stage);
    }
    // Sort: live by minute desc, upcoming by kickoff asc, finished by kickoff desc
    return list.slice().sort((a, b) => {
      if (a.status === 'LIVE' && b.status === 'LIVE') return b.minute - a.minute;
      if (a.status === 'UPCOMING' && b.status === 'UPCOMING') return a.kickoffAt - b.kickoffAt;
      if (a.status === 'FINISHED' && b.status === 'FINISHED') return b.kickoffAt - a.kickoffAt;
      return 0;
    });
  }, [matches, tab, stage]);

  return (
    <section id="live-scores" className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-red-500 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-red-400 font-semibold">Every Match · World Cup 2026</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
              Live <span className="text-gradient-emerald">Scores</span>
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              {counts && (
                <>
                  <span className="text-red-400 font-semibold">{counts.live} live</span>
                  <span className="text-white/30 mx-2">·</span>
                  <span className="text-cyan-300">{counts.upcoming} upcoming</span>
                  <span className="text-white/30 mx-2">·</span>
                  <span className="text-emerald-300">{counts.finished} finished</span>
                  <span className="text-white/30 mx-2">·</span>
                  <span>{counts.total} total matches</span>
                </>
              )}
            </p>
          </div>

          {/* Auto-refresh badge */}
          <div className="glass rounded-full px-3 py-1.5 text-[10px] tracking-widest uppercase text-white/60 flex items-center gap-2">
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Auto-refreshing · 6s
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-1.5 inline-flex flex-wrap gap-1 mb-4">
          {STATUS_TABS.map((t) => {
            const count = counts ? (t.key === 'ALL' ? counts.total : counts[t.key.toLowerCase()]) : null;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  active ? 'text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                {active && (
                  <motion.div layoutId="tabBg" className="absolute inset-0 rounded-xl" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)` }} transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative flex items-center gap-2">
                  {t.key === 'LIVE' && (
                    <span className="relative flex items-center justify-center w-2 h-2">
                      {!active && <span className="pulse-ring" />}
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-black' : 'bg-red-500'}`} />
                    </span>
                  )}
                  {t.label}
                  {count != null && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${active ? 'bg-black/20' : 'bg-white/10'}`}>{count}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STAGE_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all border ${
                stage === s
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.02] text-white/60 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass rounded-3xl p-16 text-center text-white/50"
            >
              No matches in this filter right now.
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((m) => (
                <MatchCard key={m.id} m={m} onClick={() => setSelected(m)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && <MatchModal match={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
