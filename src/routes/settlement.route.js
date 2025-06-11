import express from "express";
import SettlementController from "../controllers/settlement.controller.js";

const router = express.Router();

router.get("/settlements", SettlementController.getSettlements);
router.get("/balances", SettlementController.getBalances);
router.get("/people", SettlementController.getAllPeople);
router.get("/categories/summary", SettlementController.getCategorySummary);
router.get("/analytics/monthly", SettlementController.getMonthlySummary);
router.get("/analytics/user-spending", SettlementController.getUserSpendingPattern);
router.get("/analytics/top-expenses", SettlementController.getTopExpenses);

export default router;
