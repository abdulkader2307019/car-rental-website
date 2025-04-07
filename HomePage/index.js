
<script src="LoginPage\login.js"></script>

function loginUser() {

    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html"; 
  }


  window.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const loginBtn = document.getElementById("login-btn");
    const profileBtn = document.getElementById("profile-btn");

    if (isLoggedIn) {
      loginBtn.style.display = "none";
      profileBtn.style.display = "block";
    } else {
      loginBtn.style.display = "block";
      profileBtn.style.display = "none";
    }
  });