import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: Array<{ name: string; citas: number; ingresos: number }>;
  delay?: number;
}

export function RevenueChart({ data, delay = 0 }: RevenueChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="ux-card flex h-full flex-col p-6"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Citas e ingresos</h3>
          <p className="ux-body mt-1 text-sm">Evolucion de las ultimas cuatro semanas.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-subtle)] px-3 py-1.5 text-[var(--color-text-secondary)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            Citas
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-[rgba(143,94,56,0.12)] px-3 py-1.5 text-[var(--color-accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            Ingresos
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="rgba(17,17,17,0.18)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: "rgba(17,17,17,0.6)" }}
            />
            <YAxis
              yAxisId="left"
              stroke="rgba(17,17,17,0.18)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
              tick={{ fill: "rgba(17,17,17,0.6)" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="rgba(143,94,56,0.26)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={10}
              tick={{ fill: "rgba(143,94,56,0.72)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(8px)",
                borderColor: "rgba(17,17,17,0.08)",
                color: "#111111",
                borderRadius: "16px",
                boxShadow: "0 12px 32px rgba(17, 17, 17, 0.12)",
                padding: "12px",
              }}
              itemStyle={{ fontSize: "12px", fontWeight: 500, padding: "4px 0" }}
              labelStyle={{
                color: "rgba(17,17,17,0.56)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px",
                borderBottom: "1px solid rgba(17,17,17,0.08)",
                paddingBottom: "4px",
              }}
              cursor={{ stroke: "rgba(17,17,17,0.12)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="citas"
              name="Citas"
              stroke="#111111"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#ffffff", stroke: "#111111", strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ingresos"
              name="Ingresos ($)"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#ffffff", stroke: "var(--color-accent)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
