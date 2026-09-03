const express = require('express');
const router = express.Router()
const controller = require("../controllers/order.controller");
const { protect } = require("../middleware/auth");
const { createOrderSchema } = require("../validators/order.validator");
const validate = require("../middleware/validate");


router.use(protect); 
router.post("/", protect, validate(createOrderSchema), controller.createOrders);

router.get("/", controller.getAllOrders);
router.get("/:id", controller.getOrderById);
router.patch("/:id/cancel", controller.cancelOrder);

module.exports = router;