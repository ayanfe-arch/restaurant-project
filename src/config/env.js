require("dotenv").config();

function getEnv(key, { defaultValue, parse = (value) => value } = {}) {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`${key} is missing from environment variables`);
  }

  return parse(value);
}

module.exports = {
  port: getEnv("PORT", { defaultValue: "3000", parse: Number }),
  databaseUrl: getEnv("DATABASE_URL"),
  jwtSecret: getEnv("JWT_SECRET"),
};