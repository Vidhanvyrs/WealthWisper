
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Category } from '@/types/transaction';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [
    {
      id: '1',
      amount: -50.00,
      date: new Date('2025-04-15'),
      description: 'Grocery shopping',
      category: 'Food & Dining'
    },
    {
      id: '2',
      amount: -120.00,
      date: new Date('2025-04-14'),
      description: 'Electricity bill',
      category: 'Bills & Utilities'
    },
    {
      id: '3',
      amount: 1200.00,
      date: new Date('2025-04-01'),
      description: 'Salary',
      category: 'Income'
    },
    {
      id: '4',
      amount: -35.50,
      date: new Date('2025-04-12'),
      description: 'Restaurant dinner',
      category: 'Food & Dining'
    },
    {
      id: '5',
      amount: -200.00,
      date: new Date('2025-04-10'),
      description: 'Phone bill',
      category: 'Bills & Utilities'
    },
    {
      id: '6',
      amount: -15.00,
      date: new Date('2025-04-08'),
      description: 'Coffee with friends',
      category: 'Entertainment'
    },
  ],
  addTransaction: (transaction) => 
    set((state) => ({
      transactions: [
        { ...transaction, id: uuidv4() },
        ...state.transactions,
      ],
    })),
  editTransaction: (id, updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updatedTransaction }
          : transaction
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
    })),
}));

export const categories: Category[] = [
  'Food & Dining',
  'Bills & Utilities',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Income',
  'Other'
];
