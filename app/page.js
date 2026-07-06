'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Trophy, Activity, Calendar, Users, User, BarChart3, Target, MapPin, Award,
  Sparkles, Zap, Play, ChevronRight, Radio, Circle, TrendingUp, Flame,
  Star, Shield, Timer, Wind, Cloud, Sun, Moon, Menu, X, Signal,
  ArrowUpRight, Layers, Rocket, Crown, ChevronDown, Gamepad2
} from 'lucide-react';
import PlayerRadar from '@/components/PlayerRadar';
import MomentumChart from '@/components/MomentumChart';
import LiveScores from '@/components/LiveScores';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false, loading: () => null });

/* ---------------- NAV ---------------- */
const NAV = [
  { label: 'Home', icon: Trophy },
  { label: 'Live', icon: Radio },
  { label: 'Schedule', icon: Calendar },
  { label: 'Teams', icon: Shield },
  { label: 'Players', icon: User },
  { label: 'Stats', icon: BarChart3 },
  { label: 'Standings', icon: Layers },
  { label: 'Bracket', icon: Target },
  { label: 'Stadiums', icon: MapPin },
  { label: 'Awards', icon: Award },
  { label: 'Fantasy', icon: Gamepad2 },
  { label: 'Predictions', icon: Sparkles },
  { label: 'History', icon: Crown },
  { label: 'Records', icon: Star },
  { label: 'News', icon: Signal },
  { label: 'Highlights', icon: Play },
];

function GlassNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1400px,95vw)]"
    >
      <div className={`glass rounded-2xl px-4 py-2.5 flex items-center gap-2 transition-all duration-500 ${scrolled ? 'shadow-2xl' : ''}`}>
        <div className="flex items-center gap-2.5 pr-3 border-r border-white/10">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 flex items-center justify-center glow-emerald">
              <Trophy className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-xl leading-none tracking-widest">FIFA <span className="text-gradient-emerald">2026</span></div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 leading-none mt-1">World Cup</div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {NAV.slice(0, 10).map((n) => (
            <button key={n.label} className="group px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 whitespace-nowrap">
              <n.icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              {n.label}
            </button>
          ))}
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-1.5">
            More <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="pulse-ring" />
              <span className="w-2 h-2 rounded-full bg-red-500" />
            </span>
            <span className="tracking-widest">LIVE</span>
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-xs shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_32px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.03]">
            Sign In
          </button>
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="glass mt-3 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2"
          >
            {NAV.map((n) => (
              <button key={n.label} className="group flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-emerald-400/30 transition-all">
                <n.icon className="w-4 h-4 text-emerald-400/80" />
                <span className="text-xs font-medium">{n.label}</span>
              </button>
            ))}
            <button onClick={() => setOpen(false)} className="col-span-2 sm:col-span-4 lg:col-span-8 mt-2 py-2 text-xs text-white/50 hover:text-white flex items-center justify-center gap-1">
              <X className="w-3 h-3" /> Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------------- COUNTDOWN ---------------- */
function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setT({ d, h, m, s });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);
  return t;
}

function CountdownBox({ label, value }) {
  return (
    <div className="relative">
      <div className="glass rounded-2xl px-4 py-3 sm:px-6 sm:py-4 min-w-[74px] sm:min-w-[100px] text-center shine relative overflow-hidden">
        <motion.div
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl sm:text-5xl tracking-widest text-gradient-emerald leading-none"
        >
          {String(value).padStart(2, '0')}
        </motion.div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/50 mt-2">{label}</div>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const target = useMemo(() => Date.now() + 247 * 86400000 + 3600000 * 6, []);
  const t = useCountdown(target);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0"><HeroScene /></div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.08),transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none bg-gradient-to-t from-[#04040a] via-[#04040a]/70 to-transparent" />
      <div className="absolute inset-0 pointer-events-none grid-bg opacity-30" />

      <div className="absolute top-0 left-1/4 w-[2px] h-[70vh] bg-gradient-to-b from-emerald-400/60 to-transparent blur-sm pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-[2px] h-[60vh] bg-gradient-to-b from-cyan-400/50 to-transparent blur-sm pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[2px] h-[50vh] bg-gradient-to-b from-amber-400/50 to-transparent blur-sm pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="flex items-center gap-2 mb-6 glass px-4 py-2 rounded-full"
        >
          <span className="relative flex items-center justify-center w-2 h-2">
            <span className="pulse-ring" style={{ borderColor: 'rgba(16,185,129,0.7)' }} />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/80 font-semibold">USA · Canada · Mexico</span>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-emerald-300 font-semibold">Opening Match</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5 }}
          className="font-display text-[15vw] sm:text-[11vw] md:text-[9vw] lg:text-[8.5rem] leading-[0.85] tracking-tight text-center"
        >
          <span className="block text-gradient-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">THE</span>
          <span className="block text-gradient-emerald">BEAUTIFUL</span>
          <span className="block text-gradient-gold drop-shadow-[0_0_40px_rgba(245,158,11,0.35)]">GAME · 2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}
          className="mt-6 max-w-2xl text-center text-sm sm:text-base text-white/60 leading-relaxed"
        >
          48 nations. 104 matches. 16 iconic stadiums. One trophy. Step inside the most cinematic World Cup experience ever built.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.9 }}
          className="mt-10 flex items-end gap-2 sm:gap-4"
        >
          <CountdownBox label="Days" value={t.d} />
          <CountdownBox label="Hours" value={t.h} />
          <CountdownBox label="Minutes" value={t.m} />
          <CountdownBox label="Seconds" value={t.s} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <button className="group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500 text-black font-bold text-sm flex items-center gap-2 shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_16px_60px_rgba(16,185,129,0.65)] hover:scale-[1.03] transition-all">
            <Play className="w-4 h-4 fill-black" /> Watch Live
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <button className="px-6 py-3.5 rounded-2xl glass glass-hover font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Explore the Universe
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- SECTION HEADER ---------------- */
function SectionHeader({ eyebrow, title, accent, subtitle }) {
  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="h-px w-10 bg-gradient-to-r from-emerald-400 to-transparent" />
        <span className="text-[11px] uppercase tracking-[0.4em] text-emerald-400 font-semibold">{eyebrow}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight"
      >
        {title} <span className="text-gradient-gold">{accent}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="mt-4 text-white/60 max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ---------------- LIVE MATCH ---------------- */
function LiveMatch() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/matches/live');
        const j = await r.json();
        if (alive) setData(j.match);
      } catch (e) {}
    };
    load();
    const i = setInterval(load, 5000);
    return () => { alive = false; clearInterval(i); };
  }, []);

  if (!data) return null;

  return (
    <section className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <SectionHeader eyebrow="Live · Now Streaming" title="Match" accent="Center" subtitle="Live possession, xG, momentum and AI insights — updated in real-time from the pitch." />
          <div className="glass px-4 py-2 rounded-full text-xs text-white/70 flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-cyan-400" /> {data.weather}
            <div className="w-px h-3 bg-white/20 mx-1" />
            <Users className="w-3.5 h-3.5 text-emerald-400" /> {data.attendance.toLocaleString()} fans
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 field-lines" />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="relative flex items-center justify-center w-2 h-2">
                  <span className="pulse-ring" />
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </span>
                <span className="text-[11px] tracking-[0.35em] font-bold text-red-400">LIVE · {data.minute}{data.added ? `+${data.added}` : ''}&#39;</span>
                <div className="w-px h-4 bg-white/15" />
                <span className="text-[11px] tracking-widest text-white/50 uppercase">{data.stage}</span>
              </div>
              <span className="text-[11px] text-white/40">{data.stadium}</span>
            </div>

            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
              <div className="text-right">
                <div className="text-[11px] tracking-[0.3em] text-white/40 uppercase mb-1">Home</div>
                <div className="font-display text-5xl sm:text-7xl tracking-tight" style={{ color: data.home.color }}>{data.home.code}</div>
                <div className="text-white/70 text-sm mt-1">{data.home.name}</div>
              </div>
              <div className="text-center flex items-center gap-3 sm:gap-5">
                <motion.div key={data.home.score} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-6xl sm:text-8xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{data.home.score}</motion.div>
                <div className="text-white/30 font-display text-4xl sm:text-6xl">:</div>
                <motion.div key={data.away.score} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-6xl sm:text-8xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{data.away.score}</motion.div>
              </div>
              <div className="text-left">
                <div className="text-[11px] tracking-[0.3em] text-white/40 uppercase mb-1">Away</div>
                <div className="font-display text-5xl sm:text-7xl tracking-tight" style={{ color: data.away.color }}>{data.away.code}</div>
                <div className="text-white/70 text-sm mt-1">{data.away.name}</div>
              </div>
            </div>

            <div className="relative mt-8">
              <div className="flex justify-between text-[10px] text-white/50 mb-2 tracking-widest">
                <span>POSSESSION {data.possession.home}%</span>
                <span>{data.possession.away}% POSSESSION</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.possession.home}%` }} transition={{ duration: 1.2 }} className="h-full" style={{ background: 'linear-gradient(90deg, #facc15, #f59e0b)' }} />
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.possession.away}%` }} transition={{ duration: 1.2, delay: 0.2 }} className="h-full" style={{ background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }} />
              </div>
            </div>

            <div className="relative mt-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Momentum</span>
                <span className="text-[10px] tracking-widest text-white/40">First half</span>
              </div>
              <MomentumChart data={data.momentum} />
            </div>

            <div className="relative mt-6 grid grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'xG', h: data.xg.home, a: data.xg.away },
                { label: 'Shots', h: data.shots.home, a: data.shots.away },
                { label: 'On Target', h: data.onTarget.home, a: data.onTarget.away },
                { label: 'Corners', h: data.corners.home, a: data.corners.away },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                  <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1">{s.label}</div>
                  <div className="font-mono-alt text-sm text-white">
                    <span style={{ color: data.home.color }}>{s.h}</span>
                    <span className="text-white/30 mx-1.5">/</span>
                    <span style={{ color: data.away.color }}>{s.a}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] tracking-[0.3em] text-white/50 uppercase">Timeline</span>
                <Timer className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-3 max-h-[280px] overflow-y-auto no-scrollbar">
                {data.events.slice().reverse().map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 w-11 text-center">
                      <span className="text-[10px] font-mono-alt tracking-wider text-white/40">{e.t}&#39;</span>
                    </div>
                    <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                      e.type === 'goal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      e.type === 'yellow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      e.type === 'var' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-white/5 text-white/60 border border-white/10'
                    }`}>
                      {e.type === 'goal' ? '⚽' : e.type === 'yellow' ? '▮' : e.type === 'var' ? '⚠' : '↔'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">{e.player}</div>
                      <div className="text-[11px] text-white/40 truncate">{e.detail}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="glass rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="flex items-center justify-between mb-4 relative">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] tracking-[0.3em] text-white/60 uppercase font-semibold">AI Prediction</span>
                </div>
                <span className="text-[10px] text-white/40">Neural v3.2</span>
              </div>
              <div className="space-y-3 relative">
                {[
                  { label: `${data.home.code} win`, val: data.prediction.homeWin, color: data.home.color },
                  { label: 'Draw', val: data.prediction.draw, color: '#a3a3a3' },
                  { label: `${data.away.code} win`, val: data.prediction.awayWin, color: data.away.color },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/70 font-semibold">{p.label}</span>
                      <span className="font-mono-alt text-white">{p.val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.val}%` }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}66)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TEAMS ---------------- */
const TEAMS = [
  { code: 'BRA', name: 'Brazil', flag: '🇧🇷', power: 92, form: [1,1,1,0,1], colors: ['#fbbf24','#065f46'] },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', power: 94, form: [1,1,1,1,0], colors: ['#60a5fa','#0f172a'] },
  { code: 'FRA', name: 'France', flag: '🇫🇷', power: 90, form: [1,0,1,1,1], colors: ['#3b82f6','#dc2626'] },
  { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', power: 88, form: [1,1,0,1,1], colors: ['#e5e7eb','#dc2626'] },
  { code: 'ESP', name: 'Spain', flag: '🇪🇸', power: 89, form: [1,1,1,1,1], colors: ['#dc2626','#f59e0b'] },
  { code: 'GER', name: 'Germany', flag: '🇩🇪', power: 86, form: [0,1,1,0,1], colors: ['#171717','#f59e0b'] },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', power: 87, form: [1,1,0,1,1], colors: ['#065f46','#dc2626'] },
  { code: 'NED', name: 'Netherlands', flag: '🇳🇱', power: 85, form: [1,0,1,1,0], colors: ['#ea580c','#171717'] },
];

function TeamCard({ team, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: i * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass glass-hover rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
    >
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ background: `radial-gradient(circle, ${team.colors[0]}, transparent)` }}
      />
      <div className="relative flex items-start justify-between mb-4">
        <div className="text-5xl">{team.flag}</div>
        <div className="text-right">
          <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Power</div>
          <div className="font-display text-3xl text-gradient-gold">{team.power}</div>
        </div>
      </div>
      <div className="relative">
        <div className="font-display text-2xl tracking-wider">{team.code}</div>
        <div className="text-xs text-white/50 mt-0.5">{team.name}</div>
      </div>
      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {team.form.map((f, k) => (
            <div key={k} className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
              f === 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              f === 0 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>{f === 1 ? 'W' : f === 0 ? 'L' : 'D'}</div>
          ))}
        </div>
        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}

function TeamsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <SectionHeader eyebrow="48 Nations" title="Contenders" accent="Rising" subtitle="From Buenos Aires to Berlin — the world's finest football nations, ranked in real-time by AI." />
          <button className="text-xs text-white/60 hover:text-emerald-400 flex items-center gap-1 transition-colors">
            View all 48 teams <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {TEAMS.map((t, i) => <TeamCard key={t.code} team={t} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BRACKET ---------------- */
const BRACKET_ROUNDS = [
  { title: 'Round of 16', matches: [
    ['BRA','KOR'], ['NED','MEX'], ['ARG','AUS'], ['FRA','POL'],
    ['ENG','SEN'], ['ESP','MAR'], ['POR','SUI'], ['GER','JPN'],
  ]},
  { title: 'Quarterfinals', matches: [
    ['BRA','NED'], ['ARG','FRA'], ['ENG','ESP'], ['POR','GER'],
  ]},
  { title: 'Semifinals', matches: [
    ['ARG','BRA'], ['ESP','POR'],
  ]},
  { title: 'Final', matches: [ ['ARG','ESP'] ]},
];
const FLAG = { BRA:'🇧🇷', ARG:'🇦🇷', FRA:'🇫🇷', ENG:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', ESP:'🇪🇸', GER:'🇩🇪', POR:'🇵🇹', NED:'🇳🇱', KOR:'🇰🇷', MEX:'🇲🇽', AUS:'🇦🇺', POL:'🇵🇱', SEN:'🇸🇳', MAR:'🇲🇦', SUI:'🇨🇭', JPN:'🇯🇵' };

function BracketMatch({ pair, i, scores }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="glass glass-hover rounded-xl px-3 py-2 min-w-[170px]"
    >
      {pair.map((code, k) => (
        <div key={k} className={`flex items-center justify-between py-1 ${k === 0 ? 'border-b border-white/5' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{FLAG[code] || '⚽'}</span>
            <span className="text-xs font-semibold tracking-wider">{code}</span>
          </div>
          <span className="font-mono-alt text-xs text-white/60">{scores[k]}</span>
        </div>
      ))}
    </motion.div>
  );
}

function BracketSection() {
  return (
    <section className="relative py-24 px-4 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <SectionHeader eyebrow="Knockout Stage" title="Road to" accent="Glory" subtitle="Every match. Every dream. Auto-updating bracket with real-time predictions and match previews." />
        <div className="mt-12 overflow-x-auto no-scrollbar">
          <div className="flex items-stretch gap-6 sm:gap-8 min-w-max pb-4">
            {BRACKET_ROUNDS.map((round, ri) => (
              <div key={round.title} className="flex flex-col justify-around gap-4">
                <div className="text-[10px] tracking-[0.35em] uppercase text-emerald-400 font-semibold text-center">{round.title}</div>
                <div className={`flex flex-col ${ri === 0 ? 'gap-3' : ri === 1 ? 'gap-14' : ri === 2 ? 'gap-40' : 'gap-4'}`}>
                  {round.matches.map((pair, i) => <BracketMatch key={i} pair={pair} i={i} scores={[(ri + i) % 3, (ri + i + 1) % 3]} />)}
                </div>
              </div>
            ))}
            <div className="flex flex-col justify-center items-center gap-3 pl-4">
              <div className="text-[10px] tracking-[0.35em] uppercase text-amber-400 font-semibold">Champion</div>
              <motion.div
                whileHover={{ scale: 1.05 }} animate={{ y: [0, -6, 0] }}
                transition={{ y: { repeat: Infinity, duration: 3 } }}
                className="glass rounded-3xl p-6 glow-gold relative"
              >
                <Trophy className="w-16 h-16 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none" />
              </motion.div>
              <div className="text-center">
                <div className="text-3xl">🇦🇷</div>
                <div className="font-display text-lg tracking-widest text-gradient-gold">ARG</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PLAYER SPOTLIGHT ---------------- */
function PlayerSpotlight() {
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 25 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 25 });

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const player = {
    name: 'Lionel Messi', nation: 'Argentina', flag: '🇦🇷',
    club: 'Inter Miami', number: 10, position: 'Forward',
    goals: 106, assists: 58, apps: 187, awards: 8,
    radar: [
      { attr: 'Pace', value: 85 },
      { attr: 'Shooting', value: 96 },
      { attr: 'Passing', value: 94 },
      { attr: 'Dribbling', value: 99 },
      { attr: 'Defending', value: 42 },
      { attr: 'Physical', value: 76 },
    ],
  };

  return (
    <section className="relative py-24 px-4 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_60%)]" />
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Star Player" title="The" accent="GOAT" subtitle="Interactive holographic cards. Tilt, hover, dive into every stat that made the legend." />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: 1400 }} className="flex justify-center">
            <motion.div
              style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
              className="relative w-[280px] sm:w-[340px] h-[480px] sm:h-[560px] rounded-[32px] overflow-hidden shine"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-emerald-500 to-amber-500 opacity-30" />
              <div className="absolute inset-[2px] rounded-[30px] bg-gradient-to-br from-[#0a0a15] via-[#0f0f22] to-[#0a0a15]" />

              <div className="relative h-full p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.4em] text-white/40 uppercase">Rating</div>
                    <div className="font-display text-6xl text-gradient-gold leading-none">99</div>
                    <div className="text-xs text-white/50 mt-1">{player.position} · #{player.number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl">{player.flag}</div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mt-1">{player.nation}</div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="relative">
                    <div className="w-44 h-44 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-500/20 blur-2xl absolute inset-0" />
                    <div className="relative text-[9rem] leading-none">⚽</div>
                  </motion.div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-display text-[10rem] text-white/[0.03] leading-none pointer-events-none select-none">{player.number}</div>
                </div>

                <div className="text-center">
                  <div className="font-display text-3xl tracking-wide">{player.name.toUpperCase()}</div>
                  <div className="text-xs text-white/50 mt-1">{player.club}</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="font-mono-alt text-lg text-emerald-400">{player.goals}</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">Goals</div>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <div className="font-mono-alt text-lg text-cyan-400">{player.assists}</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono-alt text-lg text-amber-400">{player.awards}</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">Awards</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.35em] uppercase text-emerald-400 font-semibold">Performance Radar</div>
                  <div className="text-xs text-white/40 mt-1">2026 World Cup form · Live composite</div>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <PlayerRadar data={player.radar} />

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Sprint Speed', val: '34.2', unit: 'km/h', icon: Zap },
                  { label: 'Distance', val: '11.4', unit: 'km', icon: Wind },
                  { label: 'Shot Power', val: '112', unit: 'km/h', icon: Flame },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <s.icon className="w-4 h-4 text-emerald-400 mb-2" />
                    <div className="font-mono-alt text-lg text-white leading-none">{s.val}<span className="text-[10px] text-white/40 ml-1">{s.unit}</span></div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- STADIUMS ---------------- */
const STADIUMS = [
  { name: 'Estadio Azteca', city: 'Mexico City', capacity: 87523, weather: 'Clear', temp: 22, mode: 'night', img: 'https://images.pexels.com/photos/15779126/pexels-photo-15779126.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { name: 'MetLife Stadium', city: 'New York/New Jersey', capacity: 82500, weather: 'Cloudy', temp: 18, mode: 'night', img: 'https://images.unsplash.com/photo-1629217855633-79a6925d6c47?fm=jpg&q=60&w=3000&auto=format&fit=crop' },
  { name: 'SoFi Stadium', city: 'Los Angeles', capacity: 70240, weather: 'Sunny', temp: 27, mode: 'day', img: 'https://images.unsplash.com/photo-1706675780107-7c43cc487928?fm=jpg&q=60&w=3000&auto=format&fit=crop' },
  { name: 'BMO Field', city: 'Toronto', capacity: 45000, weather: 'Rain', temp: 12, mode: 'night', img: 'https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?fm=jpg&q=60&w=3000&auto=format&fit=crop' },
];

function StadiumsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="16 Iconic Venues" title="Cathedrals of" accent="Football" subtitle="Fly through every stadium. Explore day/night modes, seating, weather and fan zones — all in a cinematic experience." />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {STADIUMS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] cursor-pointer"
            >
              <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <div className="glass rounded-full px-3 py-1 flex items-center gap-2 text-[10px] tracking-widest uppercase">
                  {s.mode === 'day' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-cyan-300" />}
                  <span>{s.mode}</span>
                </div>
                <div className="glass rounded-full px-3 py-1 flex items-center gap-2 text-[10px] tracking-widest uppercase">
                  {s.weather === 'Sunny' && <Sun className="w-3 h-3 text-amber-400" />}
                  {s.weather === 'Cloudy' && <Cloud className="w-3 h-3 text-white/70" />}
                  {s.weather === 'Rain' && <Cloud className="w-3 h-3 text-cyan-400" />}
                  {s.weather === 'Clear' && <Sparkles className="w-3 h-3 text-white/70" />}
                  <span>{s.temp}°C · {s.weather}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-[10px] tracking-[0.35em] uppercase text-emerald-300/80 mb-1">{s.city}</div>
                <div className="font-display text-3xl sm:text-4xl tracking-tight">{s.name}</div>
                <div className="mt-3 flex items-center gap-4 text-xs text-white/70">
                  <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {s.capacity.toLocaleString()}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> 105 × 68m</div>
                  <div className="ml-auto flex items-center gap-1 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Fly-through <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- STATS CENTER ---------------- */
function StatsCenter() {
  const stats = [
    { label: 'Goals scored', value: 172, prev: 145, icon: Target, color: '#10b981' },
    { label: 'xG (expected)', value: 168.4, prev: 152.1, icon: TrendingUp, color: '#22d3ee' },
    { label: 'Pass Accuracy', value: 87.4, unit: '%', prev: 84.2, icon: Activity, color: '#a78bfa' },
    { label: 'Clean sheets', value: 24, prev: 18, icon: Shield, color: '#f59e0b' },
    { label: 'Distance covered', value: 4820, unit: 'km', prev: 4210, icon: Wind, color: '#f472b6' },
    { label: 'Top sprint', value: 36.8, unit: 'km/h', prev: 35.1, icon: Zap, color: '#facc15' },
  ];
  return (
    <section className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Analytics Engine" title="The Data" accent="Universe" subtitle="Every touch, pass, tackle and heartbeat — visualized in real-time with GPU-accelerated charts." />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const delta = ((s.value - s.prev) / s.prev) * 100;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-5 relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: s.color }} />
                <div className="relative flex items-start justify-between">
                  <div className="p-2 rounded-lg" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="text-[10px] font-mono-alt tracking-widest px-2 py-1 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>
                    +{delta.toFixed(1)}%
                  </div>
                </div>
                <div className="relative mt-6">
                  <div className="font-display text-5xl text-white leading-none">
                    {s.value.toLocaleString()}
                    {s.unit && <span className="text-lg text-white/40 ml-1">{s.unit}</span>}
                  </div>
                  <div className="text-xs text-white/50 mt-2 tracking-wider uppercase">{s.label}</div>
                </div>
                <svg className="mt-4 w-full h-8" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`g${i}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={s.color} stopOpacity="0.6" />
                      <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`M0,20 L11,${18 - i*2} L22,${14 + i} L33,${10 - i} L44,${16 - i*2} L55,${8 + i} L66,${12 - i} L77,${6 + i} L88,${10 - i} L100,${4 + i}`} fill={`url(#g${i})`} stroke={s.color} strokeWidth="1.4" />
                </svg>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FANTASY CTA ---------------- */
function FantasyCTA() {
  const positions = [
    { x: 50, y: 88, num: 1 }, { x: 15, y: 70, num: 2 }, { x: 38, y: 72, num: 4 },
    { x: 62, y: 72, num: 5 }, { x: 85, y: 70, num: 3 }, { x: 25, y: 50, num: 6 },
    { x: 50, y: 52, num: 8 }, { x: 75, y: 50, num: 10 }, { x: 20, y: 24, num: 11 },
    { x: 50, y: 20, num: 9 }, { x: 80, y: 24, num: 7 },
  ];
  return (
    <section className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative rounded-[36px] overflow-hidden glass p-8 sm:p-14"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-amber-500/10 pointer-events-none" />
          <div className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full mb-4">
                <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] tracking-[0.35em] uppercase font-semibold">Fantasy 2026</span>
              </div>
              <h3 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight">
                Build the <span className="text-gradient-emerald">Perfect XI</span>.<br/>
                <span className="text-gradient-gold">Dominate</span> the Cup.
              </h3>
              <p className="mt-4 text-white/60 max-w-lg">
                AI-powered captain suggestions, live fantasy points streaming with every touch, optimizer that finds the meta before it exists.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold text-sm flex items-center gap-2 shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_16px_60px_rgba(16,185,129,0.65)] hover:scale-[1.03] transition-all">
                  <Gamepad2 className="w-4 h-4" /> Draft Squad
                </button>
                <button className="px-6 py-3.5 rounded-2xl glass glass-hover font-semibold text-sm flex items-center gap-2">
                  See Leaderboard <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[linear-gradient(180deg,#052e1a,#022c22)]">
              <div className="absolute inset-0 field-lines opacity-30" />
              <div className="absolute inset-x-0 top-6 h-px bg-white/10" />
              <div className="absolute inset-x-0 bottom-6 h-px bg-white/10" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/10" />
              {positions.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.06, type: 'spring' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-white/80 shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center text-[11px] font-bold text-black">
                      {p.num}
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400/30" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- TICKER ---------------- */
function Ticker() {
  const items = ['🇧🇷 BRA 2 - 1 ARG 🇦🇷', '🇫🇷 FRA 3 - 0 POL 🇵🇱', 'MESSI · 62\' GOAL', '🇪🇸 ESP 4 - 2 MAR 🇲🇦', 'VINICIUS · Hat-trick', '🇵🇹 POR vs SUI 🇨🇭 · KO 19:00', 'MBAPPE · Golden Boot Race', '🇩🇪 GER vs JPN 🇯🇵 · Live', 'HAALAND · 5 goals in 3 games'];
  return (
    <div className="relative border-y border-white/10 bg-black/40 backdrop-blur-lg overflow-hidden">
      <div className="flex whitespace-nowrap ticker-track">
        {[...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-8 py-3 text-xs sm:text-sm font-medium text-white/80 tracking-wider">
            <span>{t}</span>
            <Circle className="w-1 h-1 fill-emerald-400 text-emerald-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8 px-4 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display text-xl tracking-widest">FIFA <span className="text-gradient-emerald">2026</span></div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 leading-none">World Cup</div>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-xs">
              The most cinematic World Cup experience ever built. A tribute to the beautiful game.
            </p>
          </div>
          {[
            { title: 'Explore', items: ['Live Matches', 'Schedule', 'Teams', 'Players', 'Standings'] },
            { title: 'Insights', items: ['Stats Center', 'Predictions', 'Fantasy', 'Records', 'History'] },
            { title: 'Experience', items: ['Stadiums', 'Highlights', 'News', 'Awards', 'AI Insights'] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[10px] tracking-[0.35em] uppercase text-emerald-400 font-semibold mb-3">{col.title}</div>
              <ul className="space-y-2">
                {col.items.map((i) => (
                  <li key={i}><a className="text-xs text-white/60 hover:text-white transition-colors" href="#">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-white/40 tracking-wider">Built for the beautiful game · 2026</div>
          <div className="text-[11px] text-white/40 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems nominal
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- APP ---------------- */
function App() {
  return (
    <main className="relative">
      <GlassNav />
      <Hero />
      <Ticker />
      <LiveScores />
      <TeamsSection />
      <BracketSection />
      <PlayerSpotlight />
      <StadiumsSection />
      <StatsCenter />
      <FantasyCTA />
      <Footer />
    </main>
  );
}

export default App;
