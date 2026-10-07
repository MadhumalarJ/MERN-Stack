const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/daily_expense_tracker")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: String
});

const Expense = mongoose.model("Expense", expenseSchema);

app.get("/", (req, res) => {
  res.send("Daily Expense Tracker Backend is Running");
});

app.post("/expenses", async (req, res) => {
  try {

    const expense = new Expense({
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category,
      date: req.body.date
    });

    await expense.save();

    res.json(expense);

  } catch (error) {

    res.status(500).json({
      message: "Unable to add expense"
    });
  }
});

app.get("/expenses", async (req, res) => {
  try {

    const expenses = await Expense.find();

    res.json(expenses);

  } catch (error) {

    res.status(500).json({
      message: "Unable to get expenses"
    });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {

    const expense =
      await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(expense);

  } catch (error) {

    res.status(500).json({
      message: "Unable to update expense"
    });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {

    await Expense.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Expense deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Unable to delete expense"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});