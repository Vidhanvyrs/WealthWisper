
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/store/transactionStore';
import { getMonthData } from '@/utils/dateUtils';

export function ExpenseChart() {
  const { transactions } = useTransactionStore();
  const data = getMonthData(transactions);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Your spending over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => {
                  // Handle the value which could be string or number
                  const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                  return [`$${numValue.toFixed(2)}`, 'Expenses'];
                }} 
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar dataKey="expense" fill="#3b82f6" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
