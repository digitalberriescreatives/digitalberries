'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function MomentumChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gHome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gAway" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0} />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" hide />
        <YAxis hide domain={[-60, 60]} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
        <Area type="monotone" dataKey="home" stroke="#facc15" fill="url(#gHome)" strokeWidth={2} />
        <Area type="monotone" dataKey="away" stroke="#60a5fa" fill="url(#gAway)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
