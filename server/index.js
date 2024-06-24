const express = require("express");
const cors = require("cors");
const app = express();
const { sql, poolPromise } = require("./lib/db.js");

app.use(express.json());
app.use(cors());

app.get("/api/recent", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT TOP 24 * FROM HourlyWeatherData ORDER BY DateTime DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

app.listen("3000", () => {
  console.log("Server is Running");
});
