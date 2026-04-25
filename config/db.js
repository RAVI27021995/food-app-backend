const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "food_app_db",
  password: "Ravip@ssw0rd",
  port: 5432,
});

module.exports = pool;