const service = require("../services/food.service");
const Restaurant = require("../models/restaurant.model");

exports.getAllFoods = async (req, res, next) => {
    try{
        const foods = await service.findAll(req.query);
        res.json({ success: true, data: foods });
    } catch (err) {
        next(err);
    }
}


exports.getFoodById = async (req, res, next) => {
    try {
        const food = await service.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }
        res.json({ success: true, data: food });
    } catch (err) {
        next(err);
    }
};

exports.createFoods = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.body.restaurant);
if (!restaurant) {
  return res.status(404).json({ success: false, message: "Restaurant not found" });
}

const ownsRestaurant = restaurant.owner?.toString() === req.user._id.toString();

if (req.user.role !== "admin" && !ownsRestaurant) {
  return res.status(403).json({
    success: false,
    message: "Not your restaurant",
  });
}

    const newFood = await service.create(req.body);
    res.status(201).json({ success: true, data: newFood });
    } catch (err) {
        next(err);
    }
};

exports.updateFood = async (req, res, next) => {
    try {
        const food = await service.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }
        const allowedFields = [ "name", "description", "price","category", "available"];

        const restaurant = await Restaurant.findById(food.restaurant);

if (!restaurant) {
  return res.status(404).json({ success: false, message: "Restaurant not found" });
}

const ownsRestaurant = restaurant.owner?.toString() === req.user._id.toString();

if (req.user.role !== "admin" && !ownsRestaurant) {
  return res.status(403).json({
    success: false,
    message: "Not your restaurant",
  });
}
const updates = {};

allowedFields.forEach((field) => {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
});

const updatedFood = await service.updateFood(req.params.id, updates);
        res.json({ success: true, data: updatedFood });
    } catch (err) {
        next(err);
    }
};

exports.deleteFood = async (req, res, next) => {
    try {
      const food = await service.findById(req.params.id);

if (!food) {
  return res.status(404).json({ success: false, message: "Food not found" });
}

const restaurant = await Restaurant.findById(food.restaurant);

if (!restaurant) {
  return res.status(404).json({ success: false, message: "Restaurant not found" });
}

const ownsRestaurant = restaurant.owner?.toString() === req.user._id.toString();

if (req.user.role !== "admin" && !ownsRestaurant) {
  return res.status(403).json({
    success: false,
    message: "Not your restaurant",
  });
}

await service.deleteFood(req.params.id);
        res.json({ success: true, message: "Food deleted successfully" });
    } catch (err) {
        next(err);
    }
};