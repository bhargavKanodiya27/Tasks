const Joi = require('joi');
const validator = Joi.object({
  name: Joi.string().min(3).max(25).required().trim(true),
  email: Joi.string().required().trim(true),
  age: Joi.number().min(1),
  password: Joi.string().min(6).max(12).required().trim(true),
});
module.exports = validator;
