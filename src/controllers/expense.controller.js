import Expense from "../models/expense.model.js";

class ExpenseController {
  // GET /expenses
  static async getAllExpenses(req, res) {
    try {
      const expenses = await Expense.find().sort({ created_at: -1 });
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

      res.status(201).json({
        success: true,
        data: saved,
        message: "Expense added successfully",
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

      // Update fields
      Object.assign(existing, req.body);
      await existing.validate(); // validate updated data
      const updated = await existing.save();

      res.status(200).json({
        success: true,
        data: updated,
        message: "Expense updated successfully",
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

      res.status(200).json({
        success: true,
        data: deleted,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default ExpenseController;
