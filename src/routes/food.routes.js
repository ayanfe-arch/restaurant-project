const express = require('express');
const router = express.Router();
const controller = require("../controllers/food.controller");
const { protect, authorize } = require("../middleware/auth");
const { createFoodSchema } = require("../validators/menuItem.validator");
const validate = require("../middleware/validate");


router.get("/", protect, controller.getAllFoods);
router.get("/:id", protect, controller.getFoodById);
router.post("/", protect, authorize("owner", "admin"), validate(createFoodSchema), controller.createFoods);
router.patch("/:id", protect, authorize("owner", "admin"), controller.updateFood);
router.delete("/:id", protect, authorize("owner", "admin"), controller.deleteFood);


module.exports = router;
