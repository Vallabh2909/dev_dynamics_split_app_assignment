import express from "express";
import ExpenseController from "../controllers/expense.controller.js";

const router = express.Router();

router.get("/expenses", ExpenseController.getAllExpenses);
router.post("/expenses", ExpenseController.addExpense);
router.put("/expenses/:id", ExpenseController.updateExpense);
router.delete("/expenses/:id", ExpenseController.deleteExpense);

export default router;
