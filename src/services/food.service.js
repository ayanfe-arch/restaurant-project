const Food = require("../models/menuItem.model")

const findAll = async (query) => {
    const limit = Number(query.limit) || 0;
  return Food.find().limit(limit);
}

const findById = async (id) => {
    return Food.findById(id);
}

const create = async (body) => {
    const newFood = new Food(body);
       await newFood.save();
       return newFood;
}

const updateFood = async (id, body) => {
    const updatedFood = await Food.findByIdAndUpdate(id, body, { 
        new: true,
        runValidators: true
     });
    return updatedFood;
};

const deleteFood = async (id) => {
  return Food.findByIdAndDelete(id);
}

module.exports = { findAll, findById, create, updateFood, deleteFood };