// 1. DOM ELEMENTS
const userName = document.getElementById("userName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signUpBtn");
const passToggle = document.getElementById("passToggle");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const city = document.getElementById("city");
const phone = document.getElementById("phone");

// 2. HELPER FUNCTIONS

// Email Validation
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Toggle Password Visibility
const togglePass = () => {
    if (password.type === "password") {
        password.type = "text";
        passToggle.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        password.type = "password";
        passToggle.classList.replace("fa-eye", "fa-eye-slash");
    }
};

// 3. MAIN SIGNUP FUNCTION (Integrated with Database)
const signUpFunc = async () => {
    // Client-side Validation
    if (!userName.value || !email.value || !password.value) {
        return alert("Please fill in all required details (Name, Email, Password).");
    } 
    
    if (!validateEmail(email.value)) {
        return alert("Please enter a valid email address.");
    }

    if (password.value.length < 8) {
        return alert("Password must be at least 8 characters long.");
    }

    // Prepare the data to send to Node.js
    const userPayload = {
        userName: userName.value, // Matches Mongoose Schema
        email: email.value,
        password: password.value,
        age: age.value,
        gender: gender.value,
        city: city.value,
        phone: phone.value
    };

    try {
        // Show a "Processing" state (Optional but good practice)
        signUpBtn.innerText = "Registering...";
        signUpBtn.disabled = true;

        const response = await fetch("/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userPayload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("User Registered Successfully! 🐦‍🔥");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            // Show error message from backend (e.g., "User already exists")
            alert(data.msg || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Signup Error:", error);
        alert("Server is not responding. Check your connection.");
    } finally {
        // Reset button state
        signUpBtn.innerText = "Sign Up";
        signUpBtn.disabled = false;
    }
};

// 4. EVENT LISTENERS
if (signUpBtn) {
    signUpBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signUpFunc();
    });
}

if (passToggle) {
    passToggle.addEventListener("click", togglePass);
}