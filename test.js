import Expense from './src/models/expense.model.js'
import mongoose from 'mongoose';
import User from './src/models/user.model.js';
mongoose.connect('mongodb://localhost:27017/expense_tracker');

const expense = new Expense({
  name: 'Lunch with friends',
  amount: 6000,
  description: 'Lunch at the new Italian restaurant',
  participants: ['Alice', 'Bob', 'Charlie'],
  split_type: 'percentage',
  category: 'Food',
  split_details: {
    Alice: 10,
    Bob: 50,
    Charlie: 40,
  },
  paid_by: 'Alice',
});

expense.save()
.then(() => {
  console.log('Expense saved successfully');
})
.catch(err => {
  console.error('Error saving expense:', err);
})
.finally(() => {
  mongoose.connection.close();
  process.exit(0);
});






