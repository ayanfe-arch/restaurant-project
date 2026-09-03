const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");
const User = require("../src/models/user.model");
const Restaurant = require("../src/models/restaurant.model");
const MenuItem = require("../src/models/menuItem.model");

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for tests");
}

let ownerToken;
let secondOwnerToken;
let adminToken;
let restaurantId;

async function registerUser({ name, email, password, role }) {
  const res = await request(app)
    .post("/auth/register")
    .send({ name, email, password, role });

  return res.body.token;
}

test.before(async () => {
  await mongoose.connect(TEST_DATABASE_URL, {
    serverSelectionTimeoutMS: 5000,
  });
});

test.after(async () => {
  await MenuItem.deleteMany({});
  await Restaurant.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

test.beforeEach(async () => {
  await MenuItem.deleteMany({});
  await Restaurant.deleteMany({});
  await User.deleteMany({});

  ownerToken = await registerUser({
    name: "Food Owner One",
    email: "foodowner1@example.com",
    password: "password123",
    role: "owner",
  });

  secondOwnerToken = await registerUser({
    name: "Food Owner Two",
    email: "foodowner2@example.com",
    password: "password123",
    role: "owner",
  });

  const admin = await User.create({
    name: "Food Admin",
    email: "foodadmin@example.com",
    password: "password123",
    role: "admin",
  });

  adminToken = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const restaurantRes = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Food Test Restaurant",
      address: "15 Menu Street",
      city: "Lagos",
      phone: "08012345678",
    });

  restaurantId = restaurantRes.body.data._id;
});

test("owner can create food for their own restaurant", async () => {
  const res = await request(app)
    .post("/foods")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Jollof Rice",
      description: "Smoky party rice",
      price: 2500,
      category: "Rice",
      restaurant: restaurantId,
    });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.name, "Jollof Rice");
  assert.strictEqual(res.body.data.price, 2500);
});

test("another owner cannot create food for someone else's restaurant", async () => {
  const res = await request(app)
    .post("/foods")
    .set("Authorization", `Bearer ${secondOwnerToken}`)
    .send({
      name: "Fried Rice",
      description: "Vegetable fried rice",
      price: 3000,
      category: "Rice",
      restaurant: restaurantId,
    });

  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(res.body.success, false);
});

test("admin can create food for any restaurant", async () => {
  const res = await request(app)
    .post("/foods")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Chicken",
      description: "Grilled chicken",
      price: 4500,
      category: "Protein",
      restaurant: restaurantId,
    });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.name, "Chicken");
});