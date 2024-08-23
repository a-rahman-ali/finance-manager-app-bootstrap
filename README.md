# Personal Finance Manager - Bootstrap5

## Overview

The **Personal Finance Manager** is a web application designed to help users manage their finances efficiently. Built using **HTML**, **CSS**, **Bootstrap5** and **JavaScript**, this application allows users to track expenses, view their financial summary, and manage their accounts. The app leverages `json-server` for backend data handling.

## Features

- **User Authentication**: Signup and login functionality to secure user data.
- **Expense Management**: Add, update, and delete expenses.
- **Dashboard**: View financial summary and recent transactions.
- **User Profile**: View user details, including the number of times amounts have been credited.

## Folder Structure

    finance-manager-app/
    │
    ├── public/
    │ ├── about.html # About page displaying user information
    │ ├── dashboard.html # Main dashboard for managing finances
    │ ├── homepage.html # Homepage of the application
    │ ├── index.html # Landing page with login functionality
    │ ├── signup.html # Signup page for new users 
    │
    ├── src/
    │ ├── about.js # JavaScript for the about page functionality
    │ ├── auth.js # Handles user authentication (signup and login)
    │ ├── data-fetch.js # Fetches data from the json-server
    │ ├── expense-tables.js # Manages expense tables on the dashboard
    │ ├── signup.js # Handles the signup form submission
    │ ├── validations.js # Validation logic for forms
    │ └── z-user-logo.webp # User logo image
    │
    ├── styles/
    │ ├── about.css # Styles for the about page
    │ ├── dashboard.css # Styles for the dashboard page
    │ ├── homepage.css # Styles for the homepage
    │ ├── styles.css # General styles used across the app
    │
    ├── data.json # JSON file used to store user and expense data

**all the HTML files have been integrated with Bootstrap CDN links**

## Technologies Used
- HTML5
- CSS3
- Bootstrap5(CDN links)
- JavaScript (ES6)
- json-server for mock backend

## Installation and Setup

#### Prerequisites
- **Node.js** and **npm** installed on your system.

#### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/finance-manager-app.git
   cd finance-manager-app
2. **Install json-server:**
    ```bash
    npm install -g json-server
3. **Start json-server to serve data.json:**
    ```bash
    json-server --watch data.json --port 3000
4. **Open the application:**
    ```bash
    Open index.html in your browser to access the login page.

## Usage
- Signup: Create a new account on the signup page.
- Login: Log in using your credentials to access the dashboard.
- Manage Expenses: Use the dashboard to add, update, or delete expenses.
- View Profile: Go to the about page to see your profile information.

