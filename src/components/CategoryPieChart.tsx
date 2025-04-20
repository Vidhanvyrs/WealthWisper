
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/store/transactionStore';
import { formatCurrency } from '@/utils/dateUtils';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9FA4A9', '#E9ECEF'
];

export function CategoryPieChart() {
  const { transactions } = useTransactionStore();

  const categoryData = transactions
    .filter(t => t.amount < 0) // Only expenses
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Distribution of your expenses across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
