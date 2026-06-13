"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

const COLORS = [
  "hsl(185, 78%, 40%)", // Teal
  "hsl(152, 60%, 45%)", // Emerald
  "hsl(200, 70%, 45%)", // Sky
  "hsl(270, 60%, 55%)", // Purple
  "hsl(35, 80%, 55%)",  // Orange
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold text-slate-200 mb-1">{data.name}</p>
        <p style={{ color: data.payload.fill }} className="font-medium">
          {data.value}
        </p>
      </div>
    );
  }
  return null;
};

export function DistributionDonutChart({ data, height = 280 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
