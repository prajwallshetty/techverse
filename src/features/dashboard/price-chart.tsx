"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

type DataPoint = {
  date: string;
  historicalPrice?: number;
  predictedPrice?: number;
};

export function PriceChart({ data }: { data: DataPoint[] }) {
  // Find the max predicted price for a reference dot
  const peakPoint = data.reduce((prev, current) => {
    if (!current.predictedPrice) return prev;
    if (!prev) return current;
    return current.predictedPrice > (prev.predictedPrice || 0) ? current : prev;
  }, null as DataPoint | null);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted)" }}
            tickFormatter={(value) => `₹${value}`}
            domain={['dataMin - 500', 'dataMax + 500']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--surface)", 
              borderColor: "var(--border)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              fontWeight: 600
            }}
            itemStyle={{ color: "var(--foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="historicalPrice"
            stroke="var(--foreground)"
            strokeWidth={3}
            dot={false}
            name="Historical Price"
          />
          <Line
            type="monotone"
            dataKey="predictedPrice"
            stroke="var(--primary)"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={false}
            name="AI Prediction"
          />
          {peakPoint && peakPoint.predictedPrice && (
            <ReferenceDot 
              x={peakPoint.date} 
              y={peakPoint.predictedPrice} 
              r={6} 
              fill="var(--accent)" 
              stroke="var(--surface)" 
              strokeWidth={2} 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
