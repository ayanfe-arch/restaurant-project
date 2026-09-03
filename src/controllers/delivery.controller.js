const service = require("../services/delivery.service");

exports.assignRider = async (req, res, next) => {
  try {
    const delivery = await service.assignRider(
      req.params.orderId,
      req.body.riderId,
      req.user
    );

    res.json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

exports.markPickedUp = async (req, res, next) => {
  try {
    const delivery = await service.markPickedUp(
      req.params.deliveryId,
      req.user
    );

    res.json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

exports.markDelivered = async (req, res, next) => {
  try {
    const delivery = await service.markDelivered(
      req.params.deliveryId,
      req.user
    );

    res.json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};