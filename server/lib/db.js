const sql = require("mssql");
const sqlConfig = {
  user: "sa",
  password: "123",
  database: "WeatherSimulation",
  server: "localhost",
  options: {
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

module.exports = {
  sql,
  poolPromise,
};
