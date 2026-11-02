require("dotenv").config();

function validateEnv(env = process.env) {
  const requiredConfig = [
    ["DATABASE_URL", env.DATABASE_URL],
    ["JWT_SECRET", env.JWT_SECRET],
  ];

  for (const [name, value] of requiredConfig) {
    if (!value) {
      throw new Error(`${name} is missing from environment variables`);
    }
  }
}

validateEnv();

module.exports = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};