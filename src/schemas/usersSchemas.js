const Joi = require('joi');

const userData = Joi.object({
    name: Joi.string().pattern(/^[A-Z]{1}[a-z]*$/).min(2).max(20).required()
});

module.exports = { userData };