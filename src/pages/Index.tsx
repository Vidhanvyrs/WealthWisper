
import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { BudgetComparisonChart } from '@/components/BudgetComparisonChart';
import { SpendingInsights } from '@/components/SpendingInsights';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SpendingInsights />
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="charts">Charts & Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionList />
        </TabsContent>
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ExpenseChart />
            <CategoryPieChart />
          </div>
          <BudgetComparisonChart />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default Index;
