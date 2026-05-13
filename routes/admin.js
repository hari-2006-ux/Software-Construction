const express = require("express");
const router = express.Router();
const getConnection = require("../db");


// 🔹 Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const conn = await getConnection();

  const result = await conn.execute(
    `SELECT * FROM admin WHERE username = :u AND password = :p`,
    [username, password]
  );

  if (result.rows.length > 0) res.send("success");
  else res.send("fail");

  await conn.close();
});


// 🔹 Add User (FIXED FOR ORACLE)
router.post("/add", async (req, res) => {
  const { name, email, password } = req.body;

  const conn = await getConnection();

  await conn.execute(
    `INSERT INTO account_holder (name, email, password, balance)
   VALUES (:n, :e, :p, 0)`,
    [name, email, password],
    { autoCommit: true }
  );

  res.send("Account Added");

  await conn.close();
});


// 🔹 Get All Users
router.get("/all", async (req, res) => {
  const conn = await getConnection();

  const result = await conn.execute(`SELECT * FROM account_holder`);

  // convert rows to objects
  const users = result.rows.map(row => ({
    id: row[0],
    name: row[1],
    email: row[2],
    password: row[3],
    balance: row[4]
  }));

  res.json(users);

  await conn.close();
});


// 🔹 Delete User
router.delete("/delete/:id", async (req, res) => {
  const conn = await getConnection();

  await conn.execute(
    `DELETE FROM account_holder WHERE id = :id`,
    [req.params.id],
    { autoCommit: true }
  );

  res.send("Deleted");

  await conn.close();
});

module.exports = router;