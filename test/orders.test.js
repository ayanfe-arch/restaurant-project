const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const mongoose = require("mongoose");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");
const User = require("../src/models/user.model");
const Restaurant = require("../src/models/restaurant.model");
const MenuItem = require("../src/models/menuItem.model");
const Order = require("../src/models/order.model");

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for tests");
}

let ownerToken;
let customerToken;
let restaurantId;
let foodId;

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
  await Order.deleteMany({});
  await MenuItem.deleteMany({});
  await Restaurant.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

test.beforeEach(async () => {
  await Order.deleteMany({});
  await MenuItem.deleteMany({});
  await Restaurant.deleteMany({});
  await User.deleteMany({});

  ownerToken = await registerUser({
    name: "Order Owner",
    email: "orderowner@example.com",
    password: "password123",
    role: "owner",
  });

  customerToken = await registerUser({
    name: "Order Customer",
    email: "ordercustomer@example.com",
    password: "password123",
    role: "customer",
  });

  const restaurantRes = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Order Test Restaurant",
      address: "20 Order Street",
      city: "Lagos",
      phone: "08012345678",
    });

  restaurantId = restaurantRes.body.data._id;

  const foodRes = await request(app)
    .post("/foods")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Jollof Rice",
      description: "Smoky rice",
      price: 2500,
      category: "Rice",
      restaurant: restaurantId,
    });

  foodId = foodRes.body.data._id;
});

test("customer can create an order and total is calculated", async () => {
  const res = await request(app)
    .post("/orders")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      restaurant: restaurantId,
      items: [
        {
          menuItem: foodId,
          quantity: 2,
        },
      ],
    });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.total, 5000);
  assert.strictEqual(res.body.data.items[0].price, 2500);
  assert.strictEqual(res.body.data.items[0].quantity, 2);
});

test("customer cannot order unavailable food", async () => {
  await MenuItem.findByIdAndUpdate(foodId, { available: false });

  const res = await request(app)
    .post("/orders")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      restaurant: restaurantId,
      items: [
        {
          menuItem: foodId,
          quantity: 1,
        },
      ],
    });

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
});

test("customer cannot order food from another restaurant", async () => {
  const secondRestaurantRes = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      name: "Second Restaurant",
      address: "30 Wrong Street",
      city: "Lagos",
    });

  const secondRestaurantId = secondRestaurantRes.body.data._id;

  const res = await request(app)
    .post("/orders")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      restaurant: secondRestaurantId,
      items: [
        {
          menuItem: foodId,
          quantity: 1,
        },
      ],
    });

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
});