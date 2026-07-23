"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  data: { date: string; sales: number }[];
};

export default function SalesChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-muted">
        مفيش بيانات مبيعات كافية لعرض الرسم البياني حالياً.
      </div>
    );
  }

  return (
    <div className="h-64 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e50914" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#e50914" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
          <YAxis stroke="#888888" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#3f3f46",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(val: number) => [`${val} ج.م`, "المبيعات"]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#e50914"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#salesGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
