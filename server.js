const config = require("./src/config/env");
const app = require("./app");
const connectDB = require("./src/config/database");


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

