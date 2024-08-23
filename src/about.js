function bodyLoad(){
    displayUserDetails();
}
async function displayUserDetails() {
    let username = localStorage.getItem("username");

    const response = await fetch(`http://localhost:3000/expenses?username=${username}`);
    const data = await response.json();
    // console.log(data[0]);
    const emailResponse = await fetch(`http://localhost:3000/usersLogin?username=${username}`);
    const emailData = await emailResponse.json();
    console.log(emailData[0][`email`]);

    if (data) {
        document.getElementById('username').textContent = `Welcome! ${username}`;
        document.getElementById('user-username').textContent = username.toUpperCase();
        document.getElementById('user-email').textContent = emailData[0].email;
        document.getElementById('user-budget').textContent = data[0]['totalBudget'].toFixed(2);
    } else {
        document.querySelector('.user-card').innerHTML = '<p>No user logged in</p>';
    }
}

