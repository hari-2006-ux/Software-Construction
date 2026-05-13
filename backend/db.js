const oracledb = require("oracledb");

const dbConfig = {
  user: "bank_user",
  password: "582",
  connectString: "localhost/XEPDB1"
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = getConnection;