import { useState } from "react";

function AddExpense({ onExpenseAdded, onCancel }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (title.trim() === "") {
      setError("Expense title is required");
      return;
    }

    if (amount === "") {
      setError("Amount is required");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (category === "") {
      setError("Please select a category");
      return;
    }

    if (date === "") {
      setError("Date is required");
      return;
    }

    const expenseData = {
      title: title.trim(),
      amount: Number(amount),
      category: category,
      date: date
    };

    try {
      const response = await fetch(
        "http://localhost:5000/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(expenseData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      const newExpense = await response.json();

      setMessage("Expense added successfully!");

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");

      onExpenseAdded(newExpense);

    } catch (error) {
      setError(
        "Unable to add expense. Please check the backend."
      );
    }
  };

  return (
    <div className="add-expense-page">

      <div className="add-expense-box">

        <h2>Add New Expense</h2>

        <p className="add-expense-subtitle">
          Record your spending details below
        </p>

        <form onSubmit={handleSubmit}>

          <label>Expense Title</label>

          <input
            type="text"
            placeholder="Example: Lunch, Bus fare, Books"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />


          <label>Amount</label>

          <input
            type="number"
            min="0"
            placeholder="Enter amount in ₹"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
          />


          <label>Category</label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >

            <option value="">
              Select category
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Travel">
              Travel
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Medicine">
              Medicine
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Bills">
              Bills
            </option>

            <option value="Other">
              Other
            </option>

          </select>


          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          />


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {message && (
            <p className="success-message">
              {message}
            </p>
          )}


          <div className="add-expense-buttons">

            <button type="submit">
              Add Expense
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddExpense;