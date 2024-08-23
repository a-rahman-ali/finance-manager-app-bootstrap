document.addEventListener('DOMContentLoaded', function() {
    displayCategoryExpenses();
    displayMonthlyExpenses();
});

async function displayCategoryExpenses() {
    const username = localStorage.getItem('username');
    const data = await fetch(`http://localhost:3000/expenses?username=${username}`).then((res) => res.json());
    const expenses = (data.length) ? (data[0].categories) : [];
    console.log(expenses);
    const categories = {
        Groceries: document.querySelector('#groceries-table tbody'),
        Entertainment: document.querySelector('#entertainment-table tbody'),
        Utilities: document.querySelector('#utilities-table tbody'),
        Others: document.querySelector('#others-table tbody')
    };

    for (const category in categories) {
        categories[category].innerHTML = '';
    }

    const totals = {
        Groceries: 0,
        Entertainment: 0,
        Utilities: 0,
        Others: 0
    };

    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };

    for (const category in expenses) {
        if (categories[category]) {
            const expensesByMonth = {};

            expenses[category].forEach(expense => {
                const monthYear = getMonthYear(expense.date);

                if (!expensesByMonth[monthYear]) {
                    expensesByMonth[monthYear] = [];
                }

                expensesByMonth[monthYear].push(expense);
                totals[category] += parseFloat(expense.amount);
            });

            for (const monthYear in expensesByMonth) {
                const monthHeader = document.createElement('tr');
                const monthCell = document.createElement('td');
                monthCell.colSpan = 2;
                monthCell.style.fontWeight = 'bold';
                monthCell.style.textAlign = 'center';
                monthCell.textContent = monthYear;
                monthHeader.appendChild(monthCell);
                categories[category].appendChild(monthHeader);

                expensesByMonth[monthYear].forEach(expense => {
                    const row = document.createElement('tr');
                    const dateCell = document.createElement('td');
                    const amountCell = document.createElement('td');

                    dateCell.textContent = expense.date;
                    amountCell.textContent = `₹ ${expense.amount}`;

                    row.appendChild(dateCell);
                    row.appendChild(amountCell);

                    categories[category].appendChild(row);
                });
            }

            // Adding total row
            const totalRow = document.createElement('tr');
            const totalLabelCell = document.createElement('td');
            const totalAmountCell = document.createElement('td');

            totalLabelCell.textContent = 'Total';
            totalLabelCell.style.fontWeight = 'bold';
            totalAmountCell.textContent = `₹ ${totals[category].toFixed(2)}`;
            totalAmountCell.style.fontWeight = 'bold';

            totalRow.appendChild(totalLabelCell);
            totalRow.appendChild(totalAmountCell);

            categories[category].appendChild(totalRow);
        }
    }
}

async function displayMonthlyExpenses() {
    const username = localStorage.getItem('username');
    const data = await fetch(`http://localhost:3000/expenses?username=${username}`).then((res) => res.json());
    const expenses = (data.length) ? data[0].categories : [];
    
    const monthlyTable = document.querySelector('#monthly-expenses-table tbody');

    monthlyTable.innerHTML = '';

    const totalsByMonth = {};

    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };

    for (const category in expenses) {
        expenses[category].forEach(expense => {
            const monthYear = getMonthYear(expense.date);

            if (!totalsByMonth[monthYear]) {
                totalsByMonth[monthYear] = 0;
            }

            totalsByMonth[monthYear] += parseFloat(expense.amount);
        });
    }

    for (const monthYear in totalsByMonth) {
        const row = document.createElement('tr');
        const monthCell = document.createElement('td');
        const amountCell = document.createElement('td');

        monthCell.textContent = monthYear;
        amountCell.textContent = `₹ ${totalsByMonth[monthYear].toFixed(2)}`;

        row.appendChild(monthCell);
        row.appendChild(amountCell);

        monthlyTable.appendChild(row);
    }
}