const express = require('express');
const router = express.Router();
const controller = require("../controllers/restaurant.controller");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, controller.getAllRestaurants);
router.get("/:id", protect, controller.getRestaurantById);
router.post("/", protect, authorize("owner", "admin"),
controller.createRestaurants);


router.patch("/:id", protect, authorize("owner", "admin"),
controller.updateRestaurant
);
router.delete("/:id", protect, authorize("owner", "admin"), controller.deleteRestaurant);

module.exports = router;
