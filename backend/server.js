const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", require("./routes/admin"));
app.use("/account", require("./routes/account"));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});