const Joi = require("joi");
const schemas = {
  emailPOST: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(30),
    username: Joi.string().required().min(4).max(30),
  }),
  emailLoginPOST: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(30),
  }),
  updateInterestPOST: Joi.object().keys({
    is_interested: Joi.boolean().required(),
  })
};
module.exports = schemas;
