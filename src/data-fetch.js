window.onload = async function() {
    var username = localStorage.getItem('username');
    document.getElementById("username").innerHTML = `Welcome! ${username}`;

    const budget = await getBudget(username);
    // console.log("after budget")
    if (budget) {
        document.getElementById("budget").innerHTML = `₹ ${budget.totalBudget}`;
        updateCategoryAmounts(budget.categories);
    }

    const expenses = await getExpenses(username);

    fillExpensesTable(username, expenses);
    
    document.getElementById("add-expense-button").addEventListener("click", function() {
        addExpense(username);
    });
}

function toggleCard(){
    const displayCard = document.getElementById("expense-card");
    displayCard.style.display = (displayCard.style.display == "none") ? "block" : "none";
}
async function getExpenses(username) {
    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    return data.length ? data[0].categories : {};
}

async function getBudget(username) {
    // console.log("inside budget1")
    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    // console.log("inside budget2")
    const budget = await response.json();
    // console.log("inside budget3")
    return budget.length ? budget[0] : null;
}

function getCategoryAmount(category) {
    let total = 0;
    if (category) {
        for (let i = 0; i < category.length; i++) {
            total += category[i].amount;
        }
    }
    return total.toFixed(2);
}

function fillExpensesTable(username, categories) {
    const tbody = document.getElementById("expense-table-body");
    tbody.innerHTML = '';
    let totalAmount = 0;

    for (const category in categories) {
        const expenses = categories[category];
        for (const expenseIndex in expenses) {
            const expense = expenses[expenseIndex];
            const row = document.createElement("tr");

            row.appendChild(createCell(category));
            row.appendChild(createCell(expense.description));
            row.appendChild(createCell(`₹ ${expense.amount.toFixed(2)}`));
            row.appendChild(createCell(expense.date));
            row.appendChild(createButtonCell("Edit", "blue", async function() {
                await editExpense(username, category, expenseIndex);
            }));
            row.appendChild(createButtonCell("Delete", "red", async function() {
                if(confirm("Are you sure you want to delete this expense?")){
                    await deleteExpense(username, category, expenseIndex);
                }
            }));

            tbody.appendChild(row);
            totalAmount += expense.amount;
        }
    }

    document.getElementById("total-amount").innerHTML = `₹ ${totalAmount.toFixed(2)}`;
}

function createCell(content) {
    const cell = document.createElement("td");
    cell.innerHTML = content;
    return cell;
}

function createButtonCell(text, color, onClick) {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    button.innerHTML = text;
    button.style.color = color;
    if (onClick) {
        button.addEventListener("click", onClick);
    }
    cell.appendChild(button);
    return cell;
}

async function creditAmount() {
    const creditInput = prompt("Enter the amount to credit:");
    if(creditInput === null){
        console.log("You didn't enter any amount.");
        return;
    }
    if (creditInput === "") {
        alert("Please enter a valid amount.");
        return;
    }

    const creditAmount = parseFloat(creditInput);
    if (isNaN(creditAmount) || creditAmount < 0) {
        alert("Please enter a valid positive amount.");
        return;
    }

    const username = localStorage.getItem('username');
    const budget = await getBudget(username);
    if (budget) {
        budget.totalBudget += creditAmount;

        try {
            const response = await fetch(`http://localhost:3000/expenses/${budget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(budget),
            });

            if (response.ok) {
                document.getElementById("budget").innerHTML = `₹ ${budget.totalBudget.toFixed(2)}`;
                console.log("Amount credited successfully!");
            } else {
                alert("Failed to credit amount. Please try again.");
            }
        } catch (error) {
            console.error("Error crediting amount:", error);
            alert("An error occurred. Please try again.");
        }
    } else {
        alert("Failed to get budget data. Please try again.");
    }
}

async function debitAmount(){
    const debitInput = prompt("Enter the amount to debit:");
    if(debitInput === null){
        console.log("You didn't enter any amount.");
        return;
    }
    if (debitInput === "") {
        alert("Please enter a valid amount.");
        return;
    }
    const debitAmount = parseFloat(debitInput);
    if (isNaN(debitAmount)  || debitAmount < 0) {
        alert("Please enter a valid positive amount.");
        return;
    }
    const username = localStorage.getItem('username');
    const budget = await getBudget(username);
    if (budget.totalBudget > debitAmount) {
        budget.totalBudget -= debitAmount;
        try{
            const response = await fetch(`http://localhost:3000/expenses/${budget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(budget),
            });
        }
        catch(error){
            console.error("Error debiting amount:", error);
            alert("An error occurred. Please try again.");
        }
    } else{
        alert("Failed to get update. Please try again.");
    }

}

async function addExpense(username) {
    const amount = document.getElementById("expense-amount").value;
    const purpose = document.getElementById("expense-purpose").value;
    const date = document.getElementById("expense-date").value;
    const category = document.getElementById("expense-category").value;

    if (!amount || !purpose || !date || !category) {
        alert("Please fill in all fields");
        return;
    }

    const newExpense = {
        date: date,
        amount: parseFloat(amount),
        description: purpose
    };

    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    const data = await response.json();
    if (data.length === 0) {
        alert("User not found");
        return;
    }

    const userExpenses = data[0];

    if (!userExpenses.categories[category]) {
        userExpenses.categories[category] = [];
    }

    if(userExpenses.totalBudget < amount){
        alert("You don't have enough budget");
        clearCard();
        return;
    }
    userExpenses.categories[category].push(newExpense);
    userExpenses.totalBudget -= parseFloat(amount);

    const updateResponse = await fetch(`http://localhost:3000/expenses/${userExpenses.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userExpenses)
    });

    if (!updateResponse.ok) {
        alert("Failed to update expenses");
        return;
    }

    // alert("Expense added successfully!");

    updateDisplay(userExpenses);
    clearCard();
}

async function editExpense(username, category, expenseIndex) {
    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    const data = await response.json();
    if (data.length === 0) {
        alert("User not found");
        return;
    }

    const userExpenses = data[0];
    const expenses = userExpenses.categories[category];
    const expenseToEdit = expenses[expenseIndex];

    document.getElementById("expense-amount").value = expenseToEdit.amount;
    document.getElementById("expense-purpose").value = expenseToEdit.description;
    document.getElementById("expense-date").value = expenseToEdit.date;
    document.getElementById("expense-category").value = category;

    // Change the card to edit mode
    document.getElementById("expense-card-title").innerHTML = "Edit Expense";
    document.getElementById("add-expense-button").innerHTML = "Update";
    document.getElementById("add-expense-button").removeEventListener("click", addExpense);
    document.getElementById("add-expense-button").addEventListener("click", async function() {
        await updateExpense(username, category, expenseIndex);
    });
    document.getElementById("expense-card").style.display = "block";
}

async function updateExpense(username, category, expenseIndex) {
    const amount = document.getElementById("expense-amount").value;
    const purpose = document.getElementById("expense-purpose").value;
    const date = document.getElementById("expense-date").value;
    const newCategory = document.getElementById("expense-category").value;

    if (!amount || !purpose || !date || !newCategory) {
        alert("Please fill in all fields");
        return;
    }

    const updatedExpense = {
        date: date,
        amount: parseFloat(amount),
        description: purpose
    };

    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    const data = await response.json();
    if (data.length === 0) {
        alert("User not found");
        return;
    }

    const userExpenses = data[0];
    const oldCategory = category;
    const expenseToRemove = userExpenses.categories[oldCategory][expenseIndex];

    userExpenses.categories[oldCategory].splice(expenseIndex, 1); // Remove old expense
    if (!userExpenses.categories[newCategory]) {
        userExpenses.categories[newCategory] = [];
    }
    userExpenses.categories[newCategory].push(updatedExpense); // Add updated expense

    const updateResponse = await fetch(`http://localhost:3000/expenses/${userExpenses.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userExpenses)
    });

    if (!updateResponse.ok) {
        console.log("Failed to update expenses");
        return;
    }

    console.log("Expense updated successfully!");
    document.getElementById("expense-card").style.display = "none";

    updateDisplay(userExpenses);
    clearCard();
    // Change the card back to add mode
    document.getElementById("add-expense-button").innerHTML = "Add";
    document.getElementById("add-expense-button").removeEventListener("click", updateExpense);
    document.getElementById("add-expense-button").addEventListener("click", function() {
        addExpense(username);
    });
    // toggleCard();
}

async function deleteExpense(username, category, expenseIndex) {
    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    const data = await response.json();
    if (data.length === 0) {
        alert("User not found");
        return;
    }
    
    const userExpenses = data[0];
    const deletedExpense = userExpenses.categories[category][expenseIndex];
    userExpenses.categories[category].splice(expenseIndex, 1);
    // userExpenses.totalBudget += deletedExpense.amount;

    const updateResponse = await fetch(`http://localhost:3000/expenses/${userExpenses.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userExpenses)
    });

    if (!updateResponse.ok) {
        alert("Failed to delete expense");
        return;
    }

    alert("Expense deleted successfully!");

    updateDisplay(userExpenses);
}

function updateDisplay(userExpenses) {
    document.getElementById("budget").innerHTML = `₹ ${userExpenses.totalBudget}`;
    updateCategoryAmounts(userExpenses.categories);
    fillExpensesTable(localStorage.getItem('username'), userExpenses.categories);
}

function updateCategoryAmounts(categories) {
    document.getElementById("groceries").innerHTML = `₹ ${getCategoryAmount(categories.Groceries)}`;
    document.getElementById("entertainment").innerHTML = `₹ ${getCategoryAmount(categories.Entertainment)}`;
    document.getElementById("utilities").innerHTML = `₹ ${getCategoryAmount(categories.Utilities)}`;
    document.getElementById("others").innerHTML = `₹ ${getCategoryAmount(categories.Others || [])}`;
}

function clearCard() {
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-purpose").value = "";
    document.getElementById("expense-date").value = "";
    document.getElementById("expense-category").value = "";
}
