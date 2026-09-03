const Restaurant = require("../models/restaurant.model");

const findAll = async (query) => {
  const limit = Number(query.limit) || 0;
  return Restaurant.find().limit(limit);
};

const findById = async (id) => {
  return Restaurant.findById(id);
};

const create = async (body) => {
    const newRestaurant = new Restaurant(body);
    await newRestaurant.save();
    return newRestaurant;
};

const update = async (id, body) => {
  return Restaurant.findByIdAndUpdate(id, body, {
    new:true,
    runValidators: true,
  });
};

const remove = async (id) => {
  return Restaurant.findByIdAndDelete(id);
};

module.exports = {findAll, findById, create, update, remove};











