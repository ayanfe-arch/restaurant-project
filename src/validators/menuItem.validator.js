const Joi = require("joi");

const createFoodSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  available: Joi.boolean(),
  restaurant: Joi.string().required(),
});

module.exports = {
  createFoodSchema,
};