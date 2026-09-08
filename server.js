require("dotenv").config();

const app = require("./app");
const config = require("./src/config/env");
const connectDB = require("./src/config/database");


const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];


connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
  
  module.exports = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

