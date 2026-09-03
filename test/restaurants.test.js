const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const mongoose = require("mongoose");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");
const User = require("../src/models/user.model");
const Restaurant = require("../src/models/restaurant.model");

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for tests");
}

let ownerToken;
let secondOwnerToken;
let adminToken;

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
  await Restaurant.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

test.beforeEach(async () => {
  await Restaurant.deleteMany({});
  await User.deleteMany({});

  ownerToken = await registerUser({
    name: "Owner One",
    email: "owner1@example.com",
    password: "password123",
    role: "owner",
  });

  secondOwnerToken = await registerUser({
    name: "Owner Two",
    email: "owner2@example.com",
    password: "password123",
    role: "owner",
  });

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });

  adminToken = require("jsonwebtoken").sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
});

test("owner can create a restaurant", async () => {
  const res = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Mama Kitchen",
      address: "12 Food Street",
      city: "Lagos",
      phone: "08012345678",
    });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.name, "Mama Kitchen");
});

test("another owner cannot update someone else's restaurant", async () => {
  const createRes = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Owner One Place",
      address: "10 First Street",
      city: "Lagos",
    });

  const restaurantId = createRes.body.data._id;

  const updateRes = await request(app)
    .patch(`/restaurants/${restaurantId}`)
    .set("Authorization", `Bearer ${secondOwnerToken}`)
    .send({
      name: "Stolen Restaurant Name",
    });

  assert.strictEqual(updateRes.statusCode, 403);
  assert.strictEqual(updateRes.body.success, false);
});

test("admin can update any restaurant", async () => {
  const createRes = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Original Name",
      address: "22 Admin Road",
      city: "Lagos",
    });

  const restaurantId = createRes.body.data._id;

  const updateRes = await request(app)
    .patch(`/restaurants/${restaurantId}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Updated By Admin",
    });

  assert.strictEqual(updateRes.statusCode, 200);
  assert.strictEqual(updateRes.body.success, true);
  assert.strictEqual(updateRes.body.data.name, "Updated By Admin");
});