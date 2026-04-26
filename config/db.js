const { Pool } = require("pg");

console.log("DATABASE_URL:", process.env.DATABASE_URL); //temporary 
const pool = new Pool(
// {
  // user: "postgres",
  // host: "localhost",
  // database: "food_app_db",
  // password: "Ravip@ssw0rd",
  // port: 5432,
// }
{
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}
);

module.exports = pool;