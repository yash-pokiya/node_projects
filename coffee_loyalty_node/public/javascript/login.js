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

const loginFunc = async (e) => {
  if (e) e.preventDefault();

  try {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("isLogin", "true");
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

const loadData = () => {
  const logedInUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!logedInUser) {
    window.location.href = "login.html"; 
    return;
  }

  age.textContent = `Age: ${logedInUser.age}`;
  gender.textContent = `Gender: ${logedInUser.gender.charAt(0).toUpperCase() + (logedInUser.gender || "").slice(1)}`;
  city.textContent = `City: ${logedInUser.city.charAt(0).toUpperCase() + (logedInUser.city || "").slice(1)}`;
  phone.textContent = `Phone: ${logedInUser.phone}`;
  userEmail.textContent = `Email: ${logedInUser.email}`;
  const uname = logedInUser.username || "";
  userName.textContent = uname.charAt(0).toUpperCase() + uname.slice(1);

  customerId.textContent = `Customer Id: ${logedInUser.customerId || "N/A"}`;
};

const editDetail = () => {
  const logedInUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = logedInUser.username || "";
  const age = logedInUser.age ?? "";
  const gender = (logedInUser.gender || "").toLowerCase();
  profileCard.innerHTML = `
    <div class="edit-form">
        <button id="btnBack">Back</button>
        <h3>Edit Profile</h3>
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="editUserName" value="${username}">
        </div>
        <div class="form-group">
            <label>Age</label>
            <input type="number" id="editAge" value="${age}">
        </div>
        <div class="form-group">
            <label>Gender</label>
            <select id="editGender">
                <option value="Male" ${gender === "Male" ? "selected" : ""}>Male</option>
                <option value="Female" ${gender === "Female" ? "selected" : ""}>Female</option>
            </select>
        </div>
        <div class="btn-group">
            <button id="saveProfileBtn">Save Changes</button>
            <button id="cancelEditBtn">Cancel</button>
        </div>
    </div>`;

  const saveBtn = document.getElementById("saveProfileBtn");
  if (saveBtn)
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveDetail();
    });
  document
    .getElementById("cancelEditBtn")
    .addEventListener("click", () => window.location.reload());
  document
    .getElementById("btnBack")
    .addEventListener("click", () => window.location.reload());
};

const saveDetail = async () => {
  try {
    const updatedData = {
      username: document.getElementById("editUserName").value,
      age: document.getElementById("editAge").value,
      gender: document.getElementById("editGender").value,
    };

    const res = await fetch("/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.msg || "Update failed");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(data.data));
    
    const getUserAfterUpdate = JSON.parse(localStorage.getItem("currentUser"));
    const uname =
  getUserAfterUpdate.username
  "";

userName.textContent =
  uname.charAt(0).toUpperCase() + uname.slice(1);


    age.textContent = `Age: ${getUserAfterUpdate.age}`;

    gender.textContent = `Gender: ${getUserAfterUpdate.gender.charAt(0).toUpperCase() + getUserAfterUpdate.gender.slice(1)}`;

    alert(data.msg || "Profile updated successfully!");
    console.log("Response from backend:", data);
    loadData();
  } catch (error) {
    console.log(error.message);
    alert("Server error while updating profile");
  }
};


if (window.location.href.includes("user-profile.html")) {
  loadData();
}
if (loginBtn) loginBtn.addEventListener("click", loginFunc);
if (passToggle) passToggle.addEventListener("click", togglePass);
if (editBtn) editBtn.addEventListener("click", editDetail);
