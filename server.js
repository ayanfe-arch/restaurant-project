require("dotenv").config();

const app = require("./app");
const config = require("./src/config/env");
const connectDB = require("./src/config/database");


const requiredConfig = [
  ["DATABASE_URL", config.databaseUrl],
  ["JWT_SECRET", config.jwtSecret],
];

for (const [name, value] of requiredConfig) {
  if (!value) {
    throw new Error(`${name} is missing from environment variables`);
  }
}


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

