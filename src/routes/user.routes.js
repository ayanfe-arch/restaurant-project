const express = require('express');
const router = express.Router();
const controller = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), controller.getAllUsers);
router.post("/", protect, authorize("admin"), controller.createUsers);
router.patch("/me", protect, controller.updateProfile);
router.get("/me", protect, controller.getMe);
router.get("/:id", protect, authorize("admin"), controller.getUserById);
router.patch("/:id", protect, authorize("admin"), controller.updateUser);
router.delete("/:id", protect, authorize("admin"), controller.deleteUser);
module.exports = router;