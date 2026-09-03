const Order = require("../models/order.model");
const MenuItem = require("../models/menuItem.model");
const findAll = async (query, filter) => {
  const limit = Number(query.limit) || 0;
  return Order.find(filter).limit(limit);
};

const findById = async (id) => {
  return Order.findById(id);
};

const create = async (body) => {
  const { customer, restaurant, items } = body;

  let total = 0;
  const orderItems = [];

  for (const entry of items) {
    const menuItem = await MenuItem.findById(entry.menuItem);

    if (!menuItem) {
      const err = new Error("Menu item not found");
      err.status = 404;
      throw err;
    }

    if (!menuItem.available) {
      const err = new Error("Item unavailable");
      err.status = 400;
      throw err;
    }

    if (menuItem.restaurant.toString() !== restaurant.toString()) {
      const err = new Error("Menu item does not belong to this restaurant");
      err.status = 400;
      throw err;
    }

    total += menuItem.price * entry.quantity;

    orderItems.push({
      menuItem: menuItem._id,
      quantity: entry.quantity,
      price: menuItem.price,
    });
  }

  return Order.create({
    customer,
    restaurant,
    items: orderItems,
    total,
  });
};

const update = async (id, body) => {
  return Order.findByIdAndUpdate(id, body, {
    new:true,
    runValidators: true,
  });
};

const cancel = async (id) => {
  return Order.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    {
      new: true,
      runValidators: true,
    }
  );
};
module.exports = { findAll, findById, create, update, cancel };
