// DOM Elements
let email = document.getElementById("email");
let password = document.getElementById("password");
let loginBtn = document.getElementById("loginBtn");
let passToggle = document.getElementById("passToggle");
let customerId = document.getElementById("customerId");
let age = document.getElementById("age");
let gender = document.getElementById("gender");
let city = document.getElementById("city");
let phone = document.getElementById("phone");
let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");
let profileCard = document.getElementById("profileCard");
let editBtn = document.getElementById("editBtn");

// --- FUNCTIONS ---

// 1. Toggle Password Visibility
const togglePass = () => {
    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";
    passToggle.classList.toggle("fa-eye", isPassword);
    passToggle.classList.toggle("fa-eye-slash", !isPassword);
};

// 2. Login Logic (Integrated with Backend API)
const loginFunc = async (e) => {
    if (e) e.preventDefault();

    try {
        // Send values to backend, not the elements themselves
        const response = await fetch("/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.data)); 
            
            alert("Login Successfully..! 🐦‍🔥");
            window.location.href = "user-profile.html";
        } else {
            alert(data.msg || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Check if your backend is running.");
    }
};

// 3. Load Data into Profile
const loadData = () => {
    const logedInUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!logedInUser) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    // Use Optional Chaining (?.) to prevent errors if a field is missing
    age.textContent = `Age: ${logedInUser.age}`;
    gender.textContent = `Gender: ${(logedInUser.gender).charAt(0).toUpperCase() + (logedInUser.gender || "").slice(1)}`;
    city.textContent = `City: ${(logedInUser.city ).charAt(0).toUpperCase() + (logedInUser.city || "").slice(1)}`;
    phone.textContent = `Phone: ${logedInUser.phone }`;
    userEmail.textContent = `Email: ${logedInUser.email }`;
    userName.textContent = (logedInUser.userName).charAt(0).toUpperCase() + (logedInUser.userName || "").slice(1);
    customerId.textContent = `Customer Id: ${logedInUser.customerId || "N/A"}`;
};

// 4. Edit Detail Logic
const editDetail = () => {
    const logedInUser = JSON.parse(localStorage.getItem("currentUser"));
    
    profileCard.innerHTML = `
    <div class="edit-form">
        <button id="btnBack">Back</button>
        <h3>Edit Profile</h3>
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="editUserName" value="${logedInUser.userName}">
        </div>
        <div class="form-group">
            <label>Age</label>
            <input type="number" id="editAge" value="${logedInUser.age}">
        </div>
        <div class="form-group">
            <label>Gender</label>
            <select id="editGender">
                <option value="Male" ${logedInUser.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${logedInUser.gender === 'Female' ? 'selected' : ''}>Female</option>
            </select>
        </div>
        <div class="btn-group">
            <button id="saveProfileBtn">Save Changes</button>
            <button id="cancelEditBtn">Cancel</button>
        </div>
    </div>`;

    document.getElementById("saveProfileBtn").addEventListener("click", saveDetail);
    document.getElementById("cancelEditBtn").addEventListener("click", () => window.location.reload());
    document.getElementById("btnBack").addEventListener("click", () => window.location.reload());
};

// 5. Save Detail (Usually requires a PUT/PATCH request to backend)
const saveDetail = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    const updatedUser = {
        ...currentUser,
        userName: document.getElementById("editUserName").value,
        age: document.getElementById("editAge").value,
        gender: document.getElementById("editGender").value
    };

    // Update LocalStorage (In a real app, you'd fetch() to update MongoDB here)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Profile Updated Successfully!");
    window.location.reload();
};

// --- INITIALIZATION & EVENT LISTENERS ---

if (window.location.href.includes("user-profile.html")) {
    loadData();
}

if (loginBtn) loginBtn.addEventListener("click", loginFunc);
if (passToggle) passToggle.addEventListener("click", togglePass);
if (editBtn) editBtn.addEventListener("click", editDetail);