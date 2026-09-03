const service = require("../services/order.service");

exports.getAllOrders = async (req, res, next) => {
  try {
    
const filter = req.user.role === "admin"
  ? {}
  : { customer: req.user._id };


    const orders = await service.findAll(req.query, filter);

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await service.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const isOwner = order.customer?.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not your order",
      });
    }

        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

exports.createOrders = async (req, res, next) => {
    try {
        const newOrder = await service.create({ ...req.body, customer: req.user._id });
        res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
        next(err);
    }
};


exports.updateOrder = async (req, res, next) => {
try {
const order = await service.findById(req.params.id);
if (!order) {
return res.status(404).json({ success: false, message: "Not found" });
}
// Admins bypass the check; owners must own this restaurant
const isOwner = order.customer?.toString() === req.user._id.toString();
if (req.user.role !== "admin" && !isOwner) {
return res.status(403).json({ success: false, message: "Not your order" });
}
const updated = await service.update(req.params.id, req.body);
res.json({ success: true, data: updated });
} catch (err) {
next(err);
}
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await service.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isOwner = order.customer?.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ success: false, message: "Not your order" });
    }

    const fifteenMinutes = 15 * 60 * 1000;
    const orderAge = Date.now() - new Date(order.createdAt).getTime();

    if (orderAge > fifteenMinutes) {
      return res.status(400).json({
        success: false,
        message: "You can no longer cancel this order",
      });
    }

    const cancelled = await service.cancel(req.params.id);

    res.json({ success: true, data: cancelled });
  } catch (err) {
    next(err);
  }
};