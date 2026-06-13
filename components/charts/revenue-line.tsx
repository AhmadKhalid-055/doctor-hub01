"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueLineChartProps {
  data: Array<{ month: string; revenue: number; target?: number }>;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
            {p.name}: ${p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueLineChart({ data, height = 280 }: RevenueLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px", color: "#94a3b8" }} />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="hsl(185, 78%, 40%)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0, fill: "hsl(185, 78%, 50%)" }}
        />
        {data[0]?.target !== undefined && (
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="hsl(152, 60%, 40%)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
