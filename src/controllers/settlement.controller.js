import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";

class SettlementController {
  // GET /settlements
  static async getSettlements(req, res) {
    try {
      const settlements = await Settlement.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: settlements,
        message: "Current settlement summary retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /balances
  static async getBalances(req, res) {
    try {
      const expenses = await Expense.find();
      const balances = {};

      for (const expense of expenses) {
        const paidBy = expense.paid_by;
        const splits = expense.split_details;

        for (const [user, amount] of splits.entries()) {
          if (!balances[user]) balances[user] = 0;
          balances[user] -= amount;
        }

        if (!balances[paidBy]) balances[paidBy] = 0;
        balances[paidBy] += expense.amount;
      }

      res.status(200).json({
        success: true,
        data: balances,
        message: "User balances calculated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /people
  static async getAllPeople(req, res) {
    try {
      const expenses = await Expense.find();
      const peopleSet = new Set();

      for (const expense of expenses) {
        peopleSet.add(expense.paid_by);
        expense.participants.forEach((p) => peopleSet.add(p));
      }

      const people = Array.from(peopleSet);

      res.status(200).json({
        success: true,
        data: people,
        message: "List of all unique people retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCategorySummary(req, res) {
    try {
      const expenses = await Expense.find();

      const summary = {};

      for (const exp of expenses) {
        const cat = exp.category || "Other";
        if (!summary[cat]) {
          summary[cat] = {
            totalSpent: 0,
            transactions: 0,
          };
        }

        summary[cat].totalSpent += exp.amount;
        summary[cat].transactions += 1;
      }

      res.status(200).json({
        success: true,
        data: summary,
        message: "Category-wise summary generated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
 static async getMonthlySummary(req, res) {
  try {
    const expenses = await Expense.find();
    const summary = {};

    for (const exp of expenses) {
      const month = new Date(exp.createdAt).toISOString().slice(0, 7); // e.g., "2025-06"
      const category = exp.category || "Other";

      // Init month entry
      if (!summary[month]) {
        summary[month] = {
          totalSpent: 0,
          transactionCount: 0,
          categoryBreakdown: {},
        };
      }

      // Update month totals
      summary[month].totalSpent += exp.amount;
      summary[month].transactionCount += 1;

      // Category breakdown inside month
      if (!summary[month].categoryBreakdown[category]) {
        summary[month].categoryBreakdown[category] = 0;
      }

      summary[month].categoryBreakdown[category] += exp.amount;
    }

    res.status(200).json({
      success: true,
      data: summary,
      message: "Enhanced monthly spending summary generated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

  static async getUserSpendingPattern(req, res) {
    try {
      const expenses = await Expense.find();
      const perUser = {};

      for (const exp of expenses) {
        const amount = exp.amount;
        const paidBy = exp.paid_by;

        if (!perUser[paidBy]) perUser[paidBy] = 0;
        perUser[paidBy] += amount;
      }

      res.status(200).json({
        success: true,
        data: perUser,
        message: "User-wise total paid amounts",
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  static async getTopExpenses(req, res) {
    try {
      const top = await Expense.find().sort({ amount: -1 }).limit(5);
      res.status(200).json({
        success: true,
        data: top,
        message: "Top 5 most expensive transactions",
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default SettlementController;
