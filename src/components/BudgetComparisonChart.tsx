
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTransactionStore } from '@/store/transactionStore';
import { useBudgetStore } from '@/store/budgetStore';
import { categories } from '@/store/transactionStore';
import { formatCurrency } from '@/utils/dateUtils';

export function BudgetComparisonChart() {
  const { transactions } = useTransactionStore();
  const { getBudgetForCategory } = useBudgetStore();
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const data = categories.filter(cat => cat !== 'Income' && cat !== 'Other').map(category => {
    const spent = Math.abs(
      transactions
        .filter(t => {
          const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
          return t.category === category && 
                 t.amount < 0 && 
                 transactionMonth === currentMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const budgeted = getBudgetForCategory(category, currentMonth);
    
    return {
      category,
      Spent: spent,
      Budget: budgeted,
      remaining: budgeted - spent,
    };
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Budget vs. Spending</CardTitle>
        <CardDescription>Compare your budgets with actual spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
              <Bar dataKey="Budget" fill="#8B5CF6" name="Budget" />
              <Bar dataKey="Spent" fill="#F97316" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
