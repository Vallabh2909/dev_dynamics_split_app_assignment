# Expense Tracker API Documentation

## Dashboard at
[https://dev-dynamics-split-app-assignment.onrender.com/dashboard.html](https://dev-dynamics-split-app-assignment.onrender.com/dashboard.html)

## Base URL
```
https://dev-dynamics-split-app-assignment.onrender.com/api
```

## Response Format
All API responses follow a consistent format:
```json
{
  "success": boolean,
  "data": object | array,
  "message": string
}
```

---

## Expense Management APIs

### 1. Get All Expenses
**Endpoint:** `GET /expenses`

**Description:** Retrieves all expenses sorted by creation date (newest first).

**Request:**
- Method: GET
- Headers: `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "expense_id",
      "amount": 100.50,
      "description": "Dinner at restaurant",
      "paid_by": "John",
      "participants": ["John", "Jane", "Bob"],
      "split_type": "equal",
      "split_details": {
        "John": 33.50,
        "Jane": 33.50,
        "Bob": 33.50
      },
      "category": "Food",
      "createdAt": "2025-06-11T10:30:00.000Z",
      "updatedAt": "2025-06-11T10:30:00.000Z"
    }
  ],
  "message": "All expenses fetched successfully"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 2. Add New Expense
**Endpoint:** `POST /expenses`

**Description:** Creates a new expense and automatically generates settlements.

**Request:**
```json
{
  "amount": 150.00,
  "description": "Grocery shopping",
  "paid_by": "Alice",
  "participants": ["Alice", "Bob", "Charlie"],
  "split_type": "equal",
  "category": "Groceries"
}
```

**Required Fields:**
- `amount` (Number): Total expense amount
- `description` (String): Expense description
- `paid_by` (String): Name of person who paid
- `participants` (Array): List of people involved in the expense
- `split_type` (String): How to split the expense

**Optional Fields:**
- `category` (String): Expense category
- `split_details` (Object): Custom split amounts (if not equal split)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_expense_id",
    "amount": 150.00,
    "description": "Grocery shopping",
    "paid_by": "Alice",
    "participants": ["Alice", "Bob", "Charlie"],
    "split_type": "equal",
    "split_details": {
      "Alice": 50.00,
      "Bob": 50.00,
      "Charlie": 50.00
    },
    "category": "Groceries",
    "createdAt": "2025-06-11T10:30:00.000Z"
  },
  "message": "Expense added and settlements created successfully"
}
```

**Status Codes:**
- 201: Created successfully
- 400: Validation error

---

### 3. Update Expense
**Endpoint:** `PUT /expenses/:id`

**Description:** Updates an existing expense and recalculates settlements.

**URL Parameters:**
- `id` (String): Expense ID

**Request:**
```json
{
  "amount": 200.00,
  "participants": ["Alice", "Bob", "Charlie", "David"],
  "split_type": "equal"
}
```

**Allowed Update Fields:**
- `amount`
- `participants`
- `split_type`
- `split_details`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "expense_id",
    "amount": 200.00,
    "participants": ["Alice", "Bob", "Charlie", "David"],
    "split_details": {
      "Alice": 50.00,
      "Bob": 50.00,
      "Charlie": 50.00,
      "David": 50.00
    },
    "updatedAt": "2025-06-11T11:00:00.000Z"
  },
  "message": "Expense updated and settlements recalculated successfully"
}
```

**Status Codes:**
- 200: Updated successfully
- 400: Validation error
- 404: Expense not found

---

### 4. Delete Expense
**Endpoint:** `DELETE /expenses/:id`

**Description:** Deletes an expense and all related settlements.

**URL Parameters:**
- `id` (String): Expense ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "deleted_expense_id",
    "amount": 100.50,
    "description": "Deleted expense"
  },
  "message": "Expense and its settlements deleted successfully"
}
```

**Status Codes:**
- 200: Deleted successfully
- 404: Expense not found
- 500: Server error

---

## Settlement & Analytics APIs

### 5. Get Settlements
**Endpoint:** `GET /settlements`

**Description:** Retrieves all settlement records sorted by creation date.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "settlement_id",
      "from": "Bob",
      "to": "Alice",
      "amount": 25.00,
      "expenseId": "expense_id",
      "createdAt": "2025-06-11T10:30:00.000Z"
    }
  ],
  "message": "Current settlement summary retrieved successfully"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 6. Get User Balances
**Endpoint:** `GET /balances`

**Description:** Calculates net balance for each user (positive = owed money, negative = owes money).

**Response:**
```json
{
  "success": true,
  "data": {
    "Alice": 75.00,
    "Bob": -25.00,
    "Charlie": -50.00
  },
  "message": "User balances calculated successfully"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 7. Get All People
**Endpoint:** `GET /people`

**Description:** Returns a list of all unique people who have participated in expenses.

**Response:**
```json
{
  "success": true,
  "data": ["Alice", "Bob", "Charlie", "David"],
  "message": "List of all unique people retrieved successfully"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 8. Get Category Summary
**Endpoint:** `GET /categories/summary`

**Description:** Provides spending summary grouped by category.

**Response:**
```json
{
  "success": true,
  "data": {
    "Food": {
      "totalSpent": 450.00,
      "transactions": 5
    },
    "Groceries": {
      "totalSpent": 300.00,
      "transactions": 3
    },
    "Other": {
      "totalSpent": 150.00,
      "transactions": 2
    }
  },
  "message": "Category-wise summary generated successfully"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 9. Get Monthly Summary
**Endpoint:** `GET /analytics/monthly`

**Description:** Provides detailed monthly spending breakdown with category analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "2025-06": {
      "totalSpent": 1200.00,
      "transactionCount": 8,
      "categoryBreakdown": {
        "Food": 600.00,
        "Groceries": 400.00,
        "Entertainment": 200.00
      }
    },
    "2025-05": {
      "totalSpent": 800.00,
      "transactionCount": 6,
      "categoryBreakdown": {
        "Food": 400.00,
        "Groceries": 250.00,
        "Other": 150.00
      }
    }
  },
  "message": "Enhanced monthly spending summary generated successfully"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 10. Get User Spending Pattern
**Endpoint:** `GET /analytics/user-spending`

**Description:** Shows total amount paid by each user across all expenses.

**Response:**
```json
{
  "success": true,
  "data": {
    "Alice": 450.00,
    "Bob": 320.00,
    "Charlie": 280.00,
    "David": 150.00
  },
  "message": "User-wise total paid amounts"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### 11. Get Top Expenses
**Endpoint:** `GET /analytics/top-expenses`

**Description:** Returns the top 5 most expensive transactions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "expense_id_1",
      "amount": 500.00,
      "description": "Weekend trip accommodation",
      "paid_by": "Alice",
      "category": "Travel",
      "createdAt": "2025-06-10T14:30:00.000Z"
    },
    {
      "_id": "expense_id_2",
      "amount": 300.00,
      "description": "Group dinner",
      "paid_by": "Bob",
      "category": "Food",
      "createdAt": "2025-06-09T19:45:00.000Z"
    }
  ],
  "message": "Top 5 most expensive transactions"
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes
- **400 Bad Request**: Invalid request data or validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed: amount is required"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Expense not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Database connection failed"
}
```

---

## Usage Examples

### Adding an expense with equal split
```bash
curl -X POST https://dev-dynamics-split-app-assignment.onrender.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 120.00,
    "description": "Pizza party",
    "paid_by": "John",
    "participants": ["John", "Jane", "Bob"],
    "split_type": "equal",
    "category": "Food"
  }'
```

### Getting user balances
```bash
curl -X GET https://dev-dynamics-split-app-assignment.onrender.com/api/balances
```

### Updating an expense
```bash
curl -X PUT https://dev-dynamics-split-app-assignment.onrender.com/api/expenses/expense_id \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.00,
    "participants": ["John", "Jane", "Bob", "Alice"]
  }'
```

---

## Notes

1. **Settlement Auto-calculation**: When an expense is added or updated, settlements are automatically calculated and stored.

2. **Validation**: The system validates all required fields before processing requests.

3. **Data Consistency**: Updating or deleting an expense automatically updates related settlement records.

4. **Sorting**: Most lists are returned sorted by creation date (newest first).

5. **Categories**: If no category is specified, expenses are categorized as "Other".

6. **Balance Calculation**: Positive balances indicate money owed to the user, negative balances indicate money the user owes.
