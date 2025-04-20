
export type Category = 
  | 'Food & Dining'
  | 'Bills & Utilities'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Income'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: Category;
}
