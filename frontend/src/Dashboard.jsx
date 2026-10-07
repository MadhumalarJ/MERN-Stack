import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";

function Dashboard({ username, onLogout }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingExpense, setEditingExpense] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/expenses"
      );

      const data = await response.json();

      setExpenses(data);
    } catch (error) {
      console.log("Unable to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses((previousExpenses) => [
      ...previousExpenses,
      newExpense
    ]);

    setShowAddExpense(false);
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);

    setEditTitle(expense.title);
    setEditAmount(expense.amount);
    setEditCategory(expense.category);
    setEditDate(expense.date);

    setError("");
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setError("");
  };

  const updateExpense = async (event) => {
    event.preventDefault();

    setError("");

    if (editTitle.trim() === "") {
      setError("Expense title is required");
      return;
    }

    if (editAmount === "" || Number(editAmount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (editCategory === "") {
      setError("Please select a category");
      return;
    }

    if (editDate === "") {
      setError("Date is required");
      return;
    }

    const updatedExpense = {
      title: editTitle.trim(),
      amount: Number(editAmount),
      category: editCategory,
      date: editDate
    };

    try {
      const response = await fetch(
        `http://localhost:5000/expenses/${editingExpense._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedExpense)
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update expense");
      }

      const updatedData = await response.json();

      setExpenses((previousExpenses) =>
        previousExpenses.map((expense) =>
          expense._id === editingExpense._id
            ? updatedData
            : expense
        )
      );

      setEditingExpense(null);

    } catch (error) {
      setError("Unable to update expense");
    }
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/expenses/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete expense");
      }

      setExpenses((previousExpenses) =>
        previousExpenses.filter(
          (expense) => expense._id !== id
        )
      );

    } catch (error) {
      alert("Unable to delete expense");
    }
  };

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Daily Expense Tracker</h1>

          <p>
            Welcome back, {username}
          </p>
        </div>

        <button onClick={onLogout}>
          Logout
        </button>

      </div>


      {/* ADD EXPENSE */}

      {showAddExpense && (
        <AddExpense
          onExpenseAdded={handleExpenseAdded}
          onCancel={() => setShowAddExpense(false)}
        />
      )}


      {/* EDIT EXPENSE */}

      {editingExpense && (
        <div className="add-expense-page">

          <div className="add-expense-box">

            <h2>Edit Expense</h2>

            <p className="add-expense-subtitle">
              Update your expense details
            </p>

            <form onSubmit={updateExpense}>

              <label>Expense Title</label>

              <input
                type="text"
                value={editTitle}
                onChange={(event) =>
                  setEditTitle(event.target.value)
                }
              />

              <label>Amount</label>

              <input
                type="number"
                min="0"
                value={editAmount}
                onChange={(event) =>
                  setEditAmount(event.target.value)
                }
              />

              <label>Category</label>

              <select
                value={editCategory}
                onChange={(event) =>
                  setEditCategory(event.target.value)
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
                value={editDate}
                onChange={(event) =>
                  setEditDate(event.target.value)
                }
              />

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <div className="add-expense-buttons">

                <button type="submit">
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="cancel-button"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* DASHBOARD */}

      {!showAddExpense && !editingExpense && (
        <div className="dashboard-content">

          <h2>Dashboard</h2>


          {/* SUMMARY */}

          <div className="summary-cards">

            <div className="summary-card">
              <h3>Total Expenses</h3>

              <p>
                ₹{totalExpenses.toFixed(2)}
              </p>
            </div>

            <div className="summary-card">
              <h3>This Month</h3>

              <p>
                ₹{monthlyExpenses.toFixed(2)}
              </p>
            </div>

            <div className="summary-card">
              <h3>Number of Expenses</h3>

              <p>
                {expenses.length}
              </p>
            </div>

          </div>


          {/* EXPENSE LIST */}

          <div className="expense-section">

            <div className="section-header">

              <div>

                <h2>
                  Recent Expenses
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748b",
                    fontSize: "13px"
                  }}
                >
                  Keep track of your latest spending
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAddExpense(true)
                }
              >
                + Add Expense
              </button>

            </div>


            {loading ? (

              <p className="no-expenses">
                Loading expenses...
              </p>

            ) : expenses.length === 0 ? (

              <p className="no-expenses">
                No expenses added yet.
              </p>

            ) : (

              <div className="expense-list">

                {expenses.map((expense) => (

                  <div
                    className="expense-item"
                    key={expense._id}
                  >

                    <div>

                      <h3>
                        {expense.title}
                      </h3>

                      <p>
                        {expense.category}
                      </p>

                    </div>


                    <div>

                      <strong>
                        ₹{Number(expense.amount).toFixed(2)}
                      </strong>

                      <p>
                        {expense.date}
                      </p>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="expense-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          startEditing(expense)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteExpense(expense._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;