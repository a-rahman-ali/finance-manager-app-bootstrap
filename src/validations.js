function validateEmail(){
    let email = document.getElementById('email');
    let emailMsg = document.getElementById('emailmsg');
    // console.log(email);
    let emailRegex = /^[a-zA-Z\d.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,8}$/;
    if(email.value == ""){
        emailMsg.innerHTML = "email field is required";
        emailMsg.style.color = "red";
    }
    else if(!email.value.match(emailRegex)){
        emailMsg.innerHTML = "Enter valid email";
    }else{
        emailMsg.innerHTML = "";
    }
}

function validatePassword(){
    let pwd = document.getElementById('password');
    let pwdMsg = document.getElementById('pwdmsg');
    if(pwd.value == ""){
        pwdMsg.innerHTML = "password field is required";
        pwdMsg.style.color = "red";
    } else if(pwd.value.length < 8){
        pwdMsg.innerHTML = "password must be atleast 8 characters";
        pwdMsg.style.color = "red";
    }
    else{
        pwdMsg.innerHTML = "";
    }
}

function validateUsername(){
    let username = document.getElementById('username');
    let usernameMsg = document.getElementById('usernamemsg');
    if(username.value == ""){
        usernameMsg.innerHTML = "username field is required";
        usernameMsg.style.color = "red";
    } else if(username.value.length < 4){
        usernameMsg.innerHTML = "username must be atleast 4 characters";
        usernameMsg.style.color = "red";
    }
    else{
        usernameMsg.innerHTML = "";
    }
}