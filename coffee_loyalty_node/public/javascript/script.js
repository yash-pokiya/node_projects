document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // DOM ELEMENTS (SAFE)
  // =======================
  const signUpHeaderBtn = document.getElementById("signUpHeaderBtn");
  const loginHeaderBtn = document.getElementById("loginHeaderBtn");
  const btnJoinNow = document.getElementById("btnJoinNow");

  // =======================
  // CHECK LOGIN STATE
  // =======================
const isLogin = () => {
  const login = JSON.parse(localStorage.getItem("isLogin")) || false;
  if (login) {
    if (window.location.href.includes("index.html")) {
      signUpHeaderBtn.textContent = "Profile";
      signUpHeaderBtn.href = "../html/user-profile.html";
      loginHeaderBtn.textContent = "Logout";
      btnJoinNow.textContent = "Redeem";
    } else if (window.location.href.includes("user-profile.html")) {
      signUpHeaderBtn.textContent = "Home";
      signUpHeaderBtn.href = "../html/index.html";
      loginHeaderBtn.textContent = "Logout";
    }
  } else {
    signUpHeaderBtn.textContent = "sign-up";
    loginHeaderBtn.textContent = "Login";
    signUpHeaderBtn.href = "../html/sign-up.html";
    loginHeaderBtn.href = "../html/login.html";
  }
};

  isLogin();

  if (loginHeaderBtn) {
    loginHeaderBtn.addEventListener("click", async (e) => {
      if (loginHeaderBtn.textContent !== "Logout") return;

      e.preventDefault();

      try {
        const res = await fetch("/user/logout", {
          method: "POST",
          credentials: "include"
        });

        const data = await res.json();

        // Clear frontend state
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("token");

        alert(data.msg || "Logout successful");
        window.location.href = "../html/login.html";

      } catch (err) {
        alert("Logout failed");
      }
    });
  }

  // =======================
  // JOIN / REDEEM
  // =======================
  if (btnJoinNow) {
    btnJoinNow.addEventListener("click", () => {
      if (btnJoinNow.textContent === "Join Now") {
        window.location.href = "../html/login.html";
      } else {
        window.location.href = "../html/redeem-page.html";
      }
    });
  }

});
