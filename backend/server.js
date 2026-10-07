const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect("mongodb://127.0.0.1:27017/daily_expense_tracker")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Expense Schema
const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },

        title: {
            type: String,
            default: ""
        },

        amount: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

// Test route
app.get("/", (req, res) => {
    res.send("Daily Expense Tracker Backend is Running");
});

// --------------------------------------------------
// GET EXPENSES FOR ONE USER
// --------------------------------------------------

app.get("/expenses", async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const expenses = await Expense.find({
            userId: userId
        }).sort({ createdAt: -1 });

        res.json(expenses);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Unable to get expenses"
        });
    }
});

// --------------------------------------------------
// ADD EXPENSE
// --------------------------------------------------

app.post("/expenses", async (req, res) => {
    try {
        const {
            userId,
            title,
            amount,
            category,
            date
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        if (!amount || !category || !date) {
            return res.status(400).json({
                message: "Amount, category and date are required"
            });
        }

        const expense = new Expense({
            userId: userId,
            title: title || "",
            amount: amount,
            category: category,
            date: date
        });

        const savedExpense = await expense.save();

        res.status(201).json(savedExpense);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Unable to save expense"
        });
    }
});

// --------------------------------------------------
// UPDATE EXPENSE
// --------------------------------------------------

app.put("/expenses/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {
            userId,
            title,
            amount,
            category,
            date
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const expense = await Expense.findOne({
            _id: id,
            userId: userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        expense.title = title || "";
        expense.amount = amount;
        expense.category = category;
        expense.date = date;

        const updatedExpense = await expense.save();

        res.json(updatedExpense);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Unable to update expense"
        });
    }
});

// --------------------------------------------------
// DELETE EXPENSE
// --------------------------------------------------

app.delete("/expenses/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const deletedExpense =
            await Expense.findOneAndDelete({
                _id: id,
                userId: userId
            });

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Unable to delete expense"
        });
    }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});