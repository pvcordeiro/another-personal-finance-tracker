const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/financeTracker", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

// Define schema and model
const financeSchema = new mongoose.Schema({
    incomes: Array,
    expenses: Array,
});

const Finance = mongoose.model("Finance", financeSchema);

// Endpoint to get data
app.get("/data", async (req, res) => {
    const financeData = await Finance.findOne();
    res.json(financeData || { incomes: [], expenses: [] });
});

// Endpoint to save data
app.post("/data", async (req, res) => {
    let financeData = await Finance.findOne();
    if (!financeData) {
        financeData = new Finance(req.body);
    } else {
        financeData.incomes = req.body.incomes;
        financeData.expenses = req.body.expenses;
    }
    await financeData.save();
    res.status(200).json({ message: "Data saved successfully!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
