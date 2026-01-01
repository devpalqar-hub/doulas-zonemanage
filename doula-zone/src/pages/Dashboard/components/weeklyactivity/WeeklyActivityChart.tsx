import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface WeeklyActivityItem {
  day: string;
  bookings: number;
  meetings: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyActivityItem[];
}

export default function WeeklyActivityChart({
  data,
}: WeeklyActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={8}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar
          dataKey="bookings"
          fill="#A855F7"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="meetings"
          fill="#3B82F6"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
