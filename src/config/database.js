const mongoose = require("mongoose");
const config = require("./env");
const connectDB = async () => {
try {
await mongoose.connect(process.env.DATABASE_URL);
console.log("MongoDB connected");
} catch (err) {
console.error("Database connection failed:", err.message);
process.exit(1);
}
};
module.exports = connectDB;
