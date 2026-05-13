let userId = 0;

const API = "http://localhost:3000";


// ================= NAVIGATION =================
function show(id) {
  document.querySelectorAll('.card').forEach(c => c.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}


// ================= LOGIN =================

// Admin Login
function adminLogin() {
  fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: adminUser.value,
      password: adminPass.value
    })
  })
    .then(res => res.text())
    .then(data => {
      console.log("Admin response:", data);

      if (data === "success") {
        localStorage.setItem("admin", "true");
        window.location.href = "admin.html";
      } else {
        alert("Invalid admin login");
      }
    })
    .catch(err => console.error(err));
}


// User Login
function userLogin() {
  fetch(`${API}/account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail.value,
      password: userPass.value
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("User response:", data);

      if (data.id) {
        userId = data.id;
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("balance", data.balance);

        window.location.href = "account.html";
      } else {
        alert("Login failed");
      }
    })
    .catch(err => console.error(err));
}


// ================= ADMIN =================

// Add Account
function addAccount() {
  fetch(`${API}/admin/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      loadUsers();
    });
}


// Load Users
function loadUsers() {
  show("users");

  fetch(`${API}/admin/all`)
    .then(r => r.json())
    .then(data => {
      userList.innerHTML = "";

      data.forEach(u => {
        let li = document.createElement("li");
        li.innerHTML = `
        ${u.name} (${u.email}) - ₹${u.balance}
        <button onclick="deleteUser(${u.id})">Delete</button>
      `;
        userList.appendChild(li);
      });
    });
}


// Delete User
function deleteUser(id) {
  fetch(`${API}/admin/delete/${id}`, {
    method: "DELETE"
  })
    .then(() => loadUsers());
}


// ================= USER =================

// Get userId from storage
if (localStorage.getItem("userId")) {
  userId = localStorage.getItem("userId");
}


// Deposit
function deposit() {
  fetch(`${API}/account/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: userId,
      amount: depAmt.value
    })
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      location.reload();
    });
}


// Withdraw
function withdraw() {
  fetch(`${API}/account/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: userId,
      amount: witAmt.value
    })
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      location.reload();
    });
}


// Transfer
function transfer() {
  fetch(`${API}/account/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: userId,
      to: receiver.value,
      amount: amt.value
    })
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      location.reload();
    });
}


// Load Transactions
function loadTransactions() {
  fetch(`${API}/account/transactions/${userId}`)
    .then(r => r.json())
    .then(data => {
      txList.innerHTML = "";

      data.forEach(t => {
        let li = document.createElement("li");
        li.textContent = `${t.type} - ₹${t.amount}`;
        txList.appendChild(li);
      });
    });
}


// ================= COMMON =================

// Welcome text
if (document.getElementById("welcome")) {
  const name = localStorage.getItem("userName");
  const bal = localStorage.getItem("balance");

  if (!name) {
    window.location.href = "index.html"; // protect page
  } else {
    welcome.innerText = `Welcome ${name} | Balance: ₹${bal}`;
  }
}


// Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}