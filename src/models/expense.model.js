import mongoose from "mongoose";
import User from "./user.model.js"; // Adjust path if needed

const ExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    paid_by: {
      type: String,
      required: true,
    },
    participants: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },
        message: "At least two participants required.",
      },
    },
    split_type: {
      type: String,
      enum: ["equal", "exact", "percentage"],
      default: "equal",
    },
    split_details: {
      type: Map,
      of: Number,
      default: {},
    },
    participants_paid: {
      type: Map,
      of: Boolean,
      default: {},
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
    everyone_paid: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

// Helper to round to 2 decimals
const roundTo2 = (num) => Math.floor(num * 100) / 100;

// ✅ Validate users before saving
ExpenseSchema.pre("validate", async function (next) {
  const expense = this;
  try {
    const userNames = await User.find({
      name: { $in: [expense.paid_by, ...expense.participants] },
    }).select("name");

    const existingNames = userNames.map((u) => u.name);
    const missing = [expense.paid_by, ...expense.participants].filter(
      (n) => !existingNames.includes(n)
    );

    if (missing.length > 0) {
      return next(
        new Error(`These users do not exist: ${missing.join(", ")}`)
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Validate and populate split_details + participants_paid
ExpenseSchema.pre("save", function (next) {
  const expense = this;
  const participants = expense.participants;
  const numParticipants = participants.length;

  if (!participants || numParticipants < 2) {
    return next(new Error("At least two participants required."));
  }

  // === Split Details ===
  if (expense.split_type === "equal") {
    const rawShare = expense.amount / numParticipants;
    const roundedShare = roundTo2(rawShare);
    const totalBeforeLast = roundedShare * (numParticipants - 1);
    const lastShare = roundTo2(expense.amount - totalBeforeLast);

    const details = new Map();
    participants.forEach((p, i) => {
      details.set(p, i === numParticipants - 1 ? lastShare : roundedShare);
    });

    expense.split_details = details;
  }

  const details = expense.split_details || new Map();
  const keys = Array.from(details.keys());

  const missing = participants.filter((p) => !keys.includes(p));
  if (missing.length > 0) {
    return next(
      new Error(`Missing split details for: ${missing.join(", ")}`)
    );
  }

  const invalids = Array.from(details.entries()).filter(([_, val]) => val <= 0);
  if (invalids.length > 0) {
    const msg = invalids.map(([k, v]) => `${k}: ${v}`).join(", ");
    return next(new Error(`Invalid split amounts (must be > 0): ${msg}`));
  }

  if (expense.split_type === "percentage") {
    const totalPercent = Array.from(details.values()).reduce((a, b) => a + b, 0);
    if (Math.abs(totalPercent - 100) > 0.01) {
      return next(
        new Error(
          `Percentage split must total 100. Found: ${totalPercent}`
        )
      );
    }

    const newDetails = new Map();
    let totalAmount = 0;

    participants.forEach((name, index) => {
      let value = roundTo2((details.get(name) / 100) * expense.amount);
      if (index === numParticipants - 1) {
        value = roundTo2(expense.amount - totalAmount);
      }
      totalAmount += value;
      newDetails.set(name, value);
    });

    expense.split_details = newDetails;
  }

  if (expense.split_type === "exact") {
    const totalAmount = Array.from(details.values()).reduce((a, b) => a + b, 0);
    if (Math.abs(totalAmount - expense.amount) > 0.01) {
      return next(
        new Error(
          `Exact split must total ${expense.amount}. Found: ${totalAmount}`
        )
      );
    }
  }

  // === Participants Paid ===
  const paidMap = new Map();
  participants.forEach((p) => {
    paidMap.set(p, p === expense.paid_by); // paid_by is always true
  });
  expense.participants_paid = paidMap;

  return next();
});

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
