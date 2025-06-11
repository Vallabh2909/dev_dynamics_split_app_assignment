import express from "express";
import mongoose from "mongoose";
import expenseRoutes from "./routes/expense.route.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", expenseRoutes);

mongoose
  .connect(process.env.MONGO_URI|| 'mongodb://localhost:27017/expense_tracker')
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
