
import { useState } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { Transaction } from '@/types/transaction';
import { formatDate, formatCurrency } from '@/utils/dateUtils';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionForm } from './TransactionForm';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function TransactionList() {
  const { transactions, deleteTransaction } = useTransactionStore();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted successfully",
    });
  };

  if (transactions.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-8">
            <p>No transactions found</p>
            <p className="text-sm">Add some transactions to see them here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className={`hover:shadow-md transition-shadow ${transaction.amount >= 0 ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date(transaction.date))}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-lg font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(transaction.amount)}
                </span>
                <div className="flex space-x-1">
                  <Dialog open={isEditOpen && selectedTransaction?.id === transaction.id} onOpenChange={(open) => {
                    if (!open) setSelectedTransaction(null);
                    setIsEditOpen(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      {selectedTransaction && (
                        <TransactionForm 
                          transaction={selectedTransaction} 
                          onClose={() => {
                            setIsEditOpen(false);
                            setSelectedTransaction(null);
                          }} 
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          transaction from your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(transaction.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
