const express = require("express");
const restaurantRoutes = require("./src/routes/restaurant.routes");
const foodRoutes = require("./src/routes/food.routes");
const orderRoutes = require("./src/routes/order.routes");
const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const deliveryRoutes = require("./src/routes/delivery.routes")

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/foods", foodRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/deliveries", deliveryRoutes)

app.use(require("./src/middleware/error"));


module.exports = app;
