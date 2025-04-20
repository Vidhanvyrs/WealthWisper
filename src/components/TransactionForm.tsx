import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTransactionStore, categories } from '@/store/transactionStore';
import { Transaction, Category } from '@/types/transaction';

const formSchema = z.object({
  amount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) !== 0,
    { message: 'Please enter a valid non-zero amount' }
  ),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Please enter a valid date' }
  ),
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
  category: z.enum(['Food & Dining', 'Bills & Utilities', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Income', 'Other'] as const),
});

type TransactionFormProps = {
  transaction?: Transaction;
  onClose?: () => void;
};

export function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const { addTransaction, editTransaction } = useTransactionStore();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction ? String(Math.abs(transaction.amount)) : '',
      date: transaction ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: transaction?.description || '',
      category: transaction?.category || 'Other',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const isExpense = form.watch('amount').startsWith('-');
    const amount = Number(values.amount) * (isExpense ? -1 : 1);
    const category = values.category as Category;
    
    if (transaction) {
      editTransaction(transaction.id, {
        amount,
        date: new Date(values.date),
        description: values.description,
        category,
      });
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated successfully",
      });
    } else {
      addTransaction({
        amount,
        date: new Date(values.date),
        description: values.description,
        category,
      });
      toast({
        title: "Transaction added",
        description: "Your transaction has been added successfully",
      });
    }
    
    form.reset();
    if (onClose) onClose();
  }

  const handleAmountToggle = () => {
    const currentAmount = form.watch('amount');
    if (!currentAmount) return;
    
    const numAmount = Number(currentAmount);
    if (isNaN(numAmount)) return;
    
    form.setValue('amount', String(Math.abs(numAmount)));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant={field.value.startsWith('-') ? "destructive" : "outline"}
                  onClick={() => {
                    const value = field.value.replace(/^-/, '');
                    form.setValue('amount', `-${value}`);
                  }}
                  className="w-24"
                >
                  Expense
                </Button>
                <Button 
                  type="button"
                  variant={!field.value.startsWith('-') ? "secondary" : "outline"}
                  onClick={() => {
                    form.setValue('amount', field.value.replace(/^-/, ''));
                  }}
                  className="w-24"
                >
                  Income
                </Button>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="What was this transaction for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {transaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}
