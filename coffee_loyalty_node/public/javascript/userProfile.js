let userName = document.getElementById("userName");
// let email = document.getElementById("email");
let customerId = document.getElementById("customerId")
let age = document.getElementById("age");
let gender = document.getElementById("gender");
let city = document.getElementById("city");
let phone = document.getElementById("phone")

// let email = "yashpokiya@gmail.com"
    const users = JSON.parse(localStorage.getItem("userData"));

    const logedInUser = users.map((a) => {
     if(email === a.email){
        return a;
     }
    });
    console.log(logedInUser);
    console.log("akhdg");
    