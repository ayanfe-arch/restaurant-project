require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const connectDB = require("../src/config/database");

async function seedAdmin() {
  await connectDB();

  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await User.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  });

  console.log("First admin created");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});