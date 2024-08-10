async function loadData() {
    const response = await fetch("http://localhost:3000/data");
    const data = await response.json();
    populateData(data);
}

async function saveData() {
    const data = collectData();
    await fetch("http://localhost:3000/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    alert("Data saved successfully!");
}

function collectData() {
    const incomeEntries = document.querySelectorAll("#incomeContainer .entry");
    const expenseEntries = document.querySelectorAll(
        "#expenseContainer .entry"
    );

    const incomes = [];
    incomeEntries.forEach((entry) => {
        const incomeData = {
            description: entry.querySelector('input[type="text"]').value,
            amounts: Array.from(
                entry.querySelectorAll('.months input[type="number"]')
            ).map((input) => parseFloat(input.value) || 0),
        };
        incomes.push(incomeData);
    });

    const expenses = [];
    expenseEntries.forEach((entry) => {
        const expenseData = {
            description: entry.querySelector('input[type="text"]').value,
            amounts: Array.from(
                entry.querySelectorAll('.months input[type="number"]')
            ).map((input) => parseFloat(input.value) || 0),
        };
        expenses.push(expenseData);
    });

    return { incomes, expenses };
}

function populateData(data) {
    const incomeContainer = document.getElementById("incomeContainer");
    const expenseContainer = document.getElementById("expenseContainer");

    incomeContainer.innerHTML = "";
    expenseContainer.innerHTML = "";

    data.incomes.forEach((income) => {
        addEntry("incomeContainer", income);
    });

    data.expenses.forEach((expense) => {
        addEntry("expenseContainer", expense);
    });

    calculateTotals();
}

function addEntry(
    containerId,
    data = { description: "", amounts: new Array(12).fill(0) }
) {
    const container = document.getElementById(containerId);

    const newEntry = document.createElement("div");
    newEntry.classList.add("entry");

    const monthLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    newEntry.innerHTML = `
        <input type="text" value="${
            data.description
        }" placeholder="Description">
        <div class="months">
            ${monthLabels
                .map(
                    (month, index) => `
                <div class="month-container">
                    <label>${month}</label>
                    <input type="number" value="${data.amounts[index]}" placeholder="€" oninput="calculateTotals()">
                </div>
            `
                )
                .join("")}
        </div>
        <div class="annual-total">€${data.amounts.reduce(
            (a, b) => a + b,
            0
        )}</div>
    `;
    container.appendChild(newEntry);
}

function calculateTotals() {
    let totalIncome = 0;
    let totalExpenses = 0;

    document.querySelectorAll("#incomeContainer .entry").forEach((entry) => {
        const amounts = Array.from(
            entry.querySelectorAll('.months input[type="number"]')
        ).map((input) => parseFloat(input.value) || 0);
        const total = amounts.reduce((a, b) => a + b, 0);
        entry.querySelector(".annual-total").textContent = `€${total}`;
        totalIncome += total;
    });

    document.querySelectorAll("#expenseContainer .entry").forEach((entry) => {
        const amounts = Array.from(
            entry.querySelectorAll('.months input[type="number"]')
        ).map((input) => parseFloat(input.value) || 0);
        const total = amounts.reduce((a, b) => a + b, 0);
        entry.querySelector(".annual-total").textContent = `€${total}`;
        totalExpenses += total;
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpenses").textContent = totalExpenses;
    document.getElementById("netSavings").textContent =
        totalIncome - totalExpenses;
}

// Load data when the page loads
window.onload = loadData;
