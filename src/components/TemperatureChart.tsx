import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ChartData {
  day: string;
  temp: number;
}

interface TemperatureChartProps {
  data: ChartData[];
}

export const TemperatureChart = ({ data }: TemperatureChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chart-fill))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(var(--chart-fill))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={false}
          axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
        />
        <YAxis
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={["dataMin - 5", "dataMax + 5"]}
        />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="hsl(var(--chart-fill))"
          strokeWidth={2}
          fill="url(#tempGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
