export function calculateSettlementsForExpense(expense) {
  const settlements = [];
  const { split_details, paid_by ,category} = expense;

  const paidAmount = expense.amount;
  const splits = Array.from(split_details.entries());

  for (const [user, amount] of splits) {
    if (user !== paid_by) {
      settlements.push({
        from: user,
        to: paid_by,
        amount: Math.round(amount * 100) / 100,
        category: category || "Other",
      });
    }
  }

  return settlements;
}
