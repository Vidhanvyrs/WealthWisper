
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore, categories } from '@/store/transactionStore';
import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency } from '@/utils/dateUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function SpendingInsights() {
  const { transactions } = useTransactionStore();
  const { getBudgetForCategory } = useBudgetStore();
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyExpenses = Math.abs(
    transactions
      .filter(t => {
        const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
        return t.amount < 0 && transactionMonth === currentMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalBudget = categories
    .filter(cat => cat !== 'Income' && cat !== 'Other')
    .reduce((sum, category) => sum + getBudgetForCategory(category, currentMonth), 0);

  // Find the category with highest overspending
  const categorySpending = categories
    .filter(cat => cat !== 'Income' && cat !== 'Other')
    .map(category => {
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
      const budget = getBudgetForCategory(category, currentMonth);
      return { category, spent, budget, overspent: spent - budget };
    });

  const mostOverspentCategory = categorySpending
    .sort((a, b) => b.overspent - a.overspent)[0];

  const isUnderBudget = monthlyExpenses <= totalBudget;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Spending Insights
          {isUnderBudget ? (
            <TrendingDown className="text-green-500" />
          ) : (
            <TrendingUp className="text-red-500" />
          )}
        </CardTitle>
        <CardDescription>Your spending analysis for this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Remaining Budget</p>
          <p className={`text-2xl font-bold ${isUnderBudget ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(totalBudget - monthlyExpenses)}
          </p>
        </div>
        {mostOverspentCategory.overspent > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">Highest Overspending</p>
            <p className="text-lg">
              <span className="font-medium">{mostOverspentCategory.category}:</span>{' '}
              <span className="text-red-500">
                {formatCurrency(mostOverspentCategory.overspent)} over budget
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
