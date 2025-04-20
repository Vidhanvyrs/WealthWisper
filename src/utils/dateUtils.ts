export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getMonthData = (transactions: any[], months = 6) => {
  const today = new Date();
  const data = [];

  for (let i = 0; i < months; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleString("default", { month: "short" });

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month.getMonth() &&
        transactionDate.getFullYear() === month.getFullYear() &&
        transaction.amount < 0
      );
    });

    const totalExpense = Math.abs(
      monthTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      )
    );

    data.unshift({
      name: monthName,
      expense: totalExpense,
    });
  }

  return data;
};
