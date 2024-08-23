const apiUrl = "http://localhost:3000";

async function login(event) {
  event.preventDefault();

  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const response = await fetch(
    `${apiUrl}/usersLogin?email=${email}&password=${password}`
  );
  const users = await response.json();

  if (users.length > 0) {
    const username = users[0].username;
    console.log("User logged in:", username);
    localStorage.setItem("username", username);
    console.log("Login successful!");
    location.href = "dashboard.html";
  } else {
    console.log("Invalid credentials");
    alert("Invalid credentials, please try again.");
  }
}

function logout() {
  localStorage.removeItem("username");
  localStorage.clear();
  location.href = "index.html";
}
