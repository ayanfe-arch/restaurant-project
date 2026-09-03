const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/delivery.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/assign/:orderId", protect, authorize("admin", "owner"), deliveryController.assignRider);
router.patch("/:deliveryId/pickup", protect, authorize("admin", "rider"), deliveryController.markPickedUp
);
router.patch("/:deliveryId/delivered", protect, authorize("admin", "rider"), deliveryController.markDelivered);
module.exports = router;
