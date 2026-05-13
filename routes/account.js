const express = require("express");
const router = express.Router();
const getConnection = require("../db");

// 🔹 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const conn = await getConnection();

  const result = await conn.execute(
    `SELECT * FROM account_holder WHERE email = :e AND password = :p`,
    [email, password]
  );

  if (result.rows.length > 0) {
    const u = result.rows[0];
    res.json({
      id: u[0],
      name: u[1],
      email: u[2],
      balance: u[4]
    });
  } else {
    res.send("fail");
  }

  await conn.close();
});

// 🔹 Deposit
router.post("/deposit", async (req, res) => {
  const { id, amount } = req.body;
  const conn = await getConnection();

  await conn.execute(
    `UPDATE account_holder SET balance = balance + :amt WHERE id = :id`,
    [amount, id]
  );

  await conn.execute(
    `INSERT INTO transactions (account_id, type, amount)
     VALUES (:id, 'deposit', :amt)`,
    [id, amount],
    { autoCommit: true }
  );

  res.send("Deposited");
  await conn.close();
});

// 🔹 Withdraw
router.post("/withdraw", async (req, res) => {
  const { id, amount } = req.body;
  const conn = await getConnection();

  const result = await conn.execute(
    `SELECT balance FROM account_holder WHERE id = :id`,
    [id]
  );

  if (result.rows[0][0] < amount) {
    res.send("Insufficient Balance");
    return;
  }

  await conn.execute(
    `UPDATE account_holder SET balance = balance - :amt WHERE id = :id`,
    [amount, id]
  );

  await conn.execute(
    `INSERT INTO transactions (account_id, type, amount)
     VALUES (:id, 'withdraw', :amt)`,
    [id, amount],
    { autoCommit: true }
  );

  res.send("Withdrawn");
  await conn.close();
});

// 🔹 Transfer
router.post("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;
  const conn = await getConnection();

  const result = await conn.execute(
    `SELECT balance FROM account_holder WHERE id = :id`,
    [from]
  );

  if (result.rows[0][0] < amount) {
    res.send("Insufficient Balance");
    return;
  }

  await conn.execute(
    `UPDATE account_holder SET balance = balance - :amt WHERE id = :id`,
    [amount, from]
  );

  await conn.execute(
    `UPDATE account_holder SET balance = balance + :amt WHERE id = :id`,
    [amount, to]
  );

  await conn.execute(
    `INSERT INTO transactions (account_id, type, amount)
     VALUES (:id, 'transfer', :amt)`,
    [from, amount],
    { autoCommit: true }
  );

  res.send("Transferred");
  await conn.close();
});

// 🔹 Transactions
router.get("/transactions/:id", async (req, res) => {
  const conn = await getConnection();

  const result = await conn.execute(
    `SELECT type, amount, date_time 
     FROM transactions 
     WHERE account_id = :id 
     ORDER BY date_time DESC`,
    [req.params.id]
  );

  const tx = result.rows.map(r => ({
    type: r[0],
    amount: r[1],
    date: r[2]
  }));

  res.json(tx);

  await conn.close();
});

module.exports = router;