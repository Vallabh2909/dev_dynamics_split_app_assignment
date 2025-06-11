import express from "express";
import mongoose from "mongoose";
import expenseRoutes from "./routes/expense.route.js";
import settlementRoutes from "./routes/settlement.route.js";
import 'dotenv/config';

// Add this debugging code
console.log('Current working directory:', process.cwd());
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

// Routes
app.use("/api", expenseRoutes);
app.use("/api", settlementRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if database connection fails
  });