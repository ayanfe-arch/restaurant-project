const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const mongoose = require("mongoose");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");
const User = require("../src/models/user.model");

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for tests");
}

test.before(async () => {
  await mongoose.connect(TEST_DATABASE_URL, {
  serverSelectionTimeoutMS: 5000,
});
});

test.after(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
});

test.beforeEach(async () => {
  await User.deleteMany({});
});

test("registers a new customer and returns a token", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token);
});

test("logs in an existing user and returns a token", async () => {
  await request(app)
    .post("/auth/register")
    .send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

  const res = await request(app)
    .post("/auth/login")
    .send({
      email: "jane@example.com",
      password: "password123",
    });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token);
});

test("rejects login with wrong password", async () => {
  await request(app)
    .post("/auth/register")
    .send({
      name: "Bad Login",
      email: "badlogin@example.com",
      password: "password123",
    });

  const res = await request(app)
    .post("/auth/login")
    .send({
      email: "badlogin@example.com",
      password: "wrongpassword",
    });

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.success, false);
});