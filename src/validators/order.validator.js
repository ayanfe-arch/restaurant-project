const Joi = require("joi");

const createOrderSchema = Joi.object({
  restaurant: Joi.string().required(),
  items: Joi.array().min(1).required(),
});

module.exports = {
  createOrderSchema,
};