const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();


// ===============================
// ADD EXPENSE
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      description,
      userId
    } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !date || !userId) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    // Create expense
    const expense = new Expense({
      title,
      amount,
      category,
      date,
      description,
      userId
    });

    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);

  } catch (error) {
    res.status(500).json({
      message: "Unable to add expense",
      error: error.message
    });
  }
});


// ===============================
// GET ALL EXPENSES
// ===============================
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch expenses",
      error: error.message
    });
  }
});


// ===============================
// GET EXPENSES OF ONE USER
// ===============================
router.get("/user/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch user expenses",
      error: error.message
    });
  }
});


// ===============================
// GET ONE EXPENSE
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.json(expense);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch expense",
      error: error.message
    });
  }
});


// ===============================
// UPDATE EXPENSE
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.json(updatedExpense);

  } catch (error) {
    res.status(500).json({
      message: "Unable to update expense",
      error: error.message
    });
  }
});


// ===============================
// DELETE EXPENSE
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(
      req.params.id
    );

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.json({
      message: "Expense deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to delete expense",
      error: error.message
    });
  }
});


module.exports = router;