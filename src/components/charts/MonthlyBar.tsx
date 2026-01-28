import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function MonthlyBar({
  data,
}: {
  data: { name: string; income: number; expenses: number }[];
}) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
