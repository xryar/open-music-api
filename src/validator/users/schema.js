const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
