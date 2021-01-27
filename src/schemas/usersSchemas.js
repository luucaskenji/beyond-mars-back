const Joi = require('joi');

const userData = Joi.object({
    name: Joi.string().min(2).max(20).required()
});

module.exports = { userData };