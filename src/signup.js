const apiUrl = "http://localhost:3000";

async function signup(event) {
  event.preventDefault();

  const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const checkResponse = await fetch(`${apiUrl}/usersLogin?email=${email}`);
    const existingUsers = await checkResponse.json();
    let userexists = document.getElementById("existsmessage");

    if (existingUsers.length > 0) {
      userexists.style.display = "flex";
      userexists.style.flexDirection = "row";
      userexists.style.justifyContent = "center";
      setTimeout(() => {
        userexists.style.display = "none";
      }, 2000);
      return;
    }
  } catch (error) {
    console.error("Error checking existing users:", error);
    alert("An error occurred. Please try again.");
    return;
  }

  let newUserId = 1;
  try {
    const allUsersResponse = await fetch(`${apiUrl}/usersLogin`);
    const allUsers = await allUsersResponse.json();

    if (allUsers.length > 0) {
      newUserId = allUsers.length + 1;
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    alert("An error occurred. Please try again.");
    return;
  }

  const newUser = { id: newUserId, username, email, password };

  try {
    const response = await fetch(`${apiUrl}/usersLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      console.log("Signup response:", await response.json());
      console.log("Signup successful! Creating default expenses...");

      const defaultExpenses = {
        username: username,
        totalBudget: 0,
        categories: {
          Groceries: [],
          Entertainment: [],
          Utilities: [],
          Others: []
        }
      };

      const expensesResponse = await fetch(`${apiUrl}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultExpenses),
      });

      if (expensesResponse.ok) {
        console.log("Default expenses created:", await expensesResponse.json());
        location.href = "../public/index.html";
      } else {
        console.error("Failed to create default expenses:", expensesResponse.statusText);
        alert("Signup failed. Please try again.");
      }
    } else {
      console.error("Signup failed:", response.statusText);
      alert("Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred. Please try again.");
  }
}
