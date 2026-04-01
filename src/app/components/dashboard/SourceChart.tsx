import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SourceData {
  name: string;
  value: number;
  color: string;
}

interface SourceChartProps {
  data: SourceData[];
  delay?: number;
}

export function SourceChart({ data, delay = 0 }: SourceChartProps) {
  const topSource = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="ux-card relative flex h-full flex-col overflow-hidden p-6"
    >
      <div className="relative z-10 mb-2">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Canal de origen</h3>
        <p className="ux-body mt-1 text-sm">Distribucion de captacion actual.</p>
      </div>

      <div className="flex-1 min-h-[200px] relative z-10 py-4 flex flex-col justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer outline-none transition-opacity hover:opacity-80"
                  style={{ outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(8px)",
                borderColor: "rgba(17,17,17,0.08)",
                color: "#111111",
                borderRadius: "16px",
                boxShadow: "0 12px 32px rgba(17, 17, 17, 0.12)",
                padding: "10px 14px",
              }}
              itemStyle={{ color: "#111111", fontSize: "13px", fontWeight: 500 }}
              formatter={(value: number) => [`${value}%`, "Porcentaje"]}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4, type: "spring" }}
            className="flex h-[110px] w-[110px] flex-col items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-center shadow-inner"
          >
            <span className="block text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">{topSource?.value ?? 0}%</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {topSource?.name ?? "Sin datos"}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border-subtle)] pt-4">
        {data.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.5 + (i * 0.05) }}
            className="group/item flex items-center gap-2 text-xs"
          >
            <span
              className="h-2.5 w-2.5 rounded shadow-sm transition-transform group-hover/item:scale-125"
              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}
            />
            <span className="text-[var(--color-text-secondary)] font-medium">{item.name}</span>
            <span className="ml-auto font-bold text-[var(--color-text-primary)] transition-colors group-hover/item:text-[var(--color-accent)]">
              {item.value}%
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
