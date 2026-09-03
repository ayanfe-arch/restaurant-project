const Delivery = require("../models/delivery.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const checkDeliveryAccess = (delivery, requester) => {
  const isAdmin = requester.role === "admin";

  const isAssignedRider =
    delivery.rider &&
    delivery.rider.toString() === requester._id.toString();

  if (!isAdmin && !isAssignedRider) {
    throw createError(
      "Only the assigned rider or an admin can update this delivery",
      403
    );
  }
};

const assignRider = async (orderId, riderId, requester) => {
  const rider = await User.findById(riderId);

  if (!rider) {
    throw createError("Rider not found", 404);
  }

  if (rider.role !== "rider") {
    throw createError("User is not a rider", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw createError("Order not found", 404);
  }

   if (requester.role !== "admin") {
    const restaurant = await Restaurant.findById(order.restaurant);

    const isRestaurantOwner =
      restaurant &&
      restaurant.owner.toString() === requester._id.toString();

    if (!isRestaurantOwner) {
      throw createError(
        "You can only assign riders for your own restaurant",
        403
      );
    }
  }

  const delivery = await Delivery.findOneAndUpdate(
    { order: orderId },
    { rider: riderId, status: "assigned" },
    { new: true, upsert: true, runValidators: true }
  );

  await Order.findByIdAndUpdate(orderId, {
    status: "out_for_delivery",
  });

  return delivery;
};

const markPickedUp = async (deliveryId, requester) => {
  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw createError("Delivery not found", 404);
  }

  checkDeliveryAccess(delivery, requester);

  if (delivery.status !== "assigned") {
    throw createError(
      "Only an assigned delivery can be marked as picked up",
      400
    );
  }

  delivery.status = "picked_up";
  await delivery.save();

  return delivery;
};

const markDelivered = async (deliveryId, requester) => {
  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw createError("Delivery not found", 404);
  }

  checkDeliveryAccess(delivery, requester);

  if (delivery.status !== "picked_up") {
    throw createError(
      "Only a picked-up delivery can be marked as delivered",
      400
    );
  }
  

  delivery.status = "delivered";
  await delivery.save();

  await Order.findByIdAndUpdate(delivery.order, {
    status: "delivered",
  });

  return delivery;
};

module.exports = {
  assignRider,
  markDelivered,
  markPickedUp,
};
