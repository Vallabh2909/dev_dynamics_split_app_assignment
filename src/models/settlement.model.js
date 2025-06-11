import mongoose from "mongoose";

const SettlementSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Entertainment",
        "Utilities",
        "Shopping",
        "Health",
        "Travel",
        "Other",
      ],
      default: "Other",
    },
  },
  { timestamps: true }
);

const Settlement = mongoose.model("Settlement", SettlementSchema);
export default Settlement;
