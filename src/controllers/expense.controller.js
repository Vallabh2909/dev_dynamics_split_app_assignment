import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";
import { calculateSettlementsForExpense } from "../utils/settlement.util.js";

class ExpenseController {
  // GET /expenses
  static async getAllExpenses(req, res) {
    try {
      const expenses = await Expense.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: expenses,
        message: "All expenses fetched successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /expenses
  static async addExpense(req, res) {
    try {
      const newExpense = new Expense(req.body);
      await newExpense.validate(); // schema validations
      const saved = await newExpense.save();

      // Generate settlements for this expense
      const settlements = calculateSettlementsForExpense(saved);
      settlements.forEach((s) => (s.expenseId = saved._id));
      await Settlement.insertMany(settlements);

      res.status(201).json({
        success: true,
        data: saved,
        message: "Expense added and settlements created successfully",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /expenses/:id
   static async updateExpense(req, res) {
    try {
      const existing = await Expense.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      // Only allow these fields to be updated
      const allowedFields = ["amount", "participants", "split_type", "split_details"];

      // Apply only allowed fields — preserve old values if not provided
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          existing[field] = req.body[field];
        }
      });

      // ✅ Now validate the real, updated document (with original or new values)
      await existing.validate();

      // ❗Only proceed after successful validation
      await Settlement.deleteMany({ expenseId: existing._id });

      const updated = await existing.save();

      const settlements = calculateSettlementsForExpense(updated);
      settlements.forEach((s) => (s.expenseId = updated._id));
      await Settlement.insertMany(settlements);

      res.status(200).json({
        success: true,
        data: updated,
        message: "Expense updated and settlements recalculated successfully",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /expenses/:id
  static async deleteExpense(req, res) {
    try {
      const deleted = await Expense.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      // Delete related settlements
      await Settlement.deleteMany({ expenseId: deleted._id });

      res.status(200).json({
        success: true,
        data: deleted,
        message: "Expense and its settlements deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default ExpenseController;
