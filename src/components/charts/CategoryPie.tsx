import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { categories } from '@/data/categories';

export function CategoryPie({
  data,
}: {
  data: { category: string; value: number }[];
}) {
  const items = data.filter((d) => d.value > 0);
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={items}
            innerRadius={58}
            outerRadius={90}
            paddingAngle={2}
          >
            {items.map((d, i) => {
              const c = categories.find((c) => c.id === d.category);
              return <Cell key={i} fill={c?.color ?? '#94a3b8'} />;
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
