const joi = require('joi'); //joi is a validation library that helps you validate user data input in an easy way using schemas

//user validation schema with joi
const registerValidationSchema = joi.object({
    name: joi.string().min(3).required(),
    password: joi.string().min(8).required(),
    password2: joi.string().min(8).required().valid(joi.ref('password')), //check that password2 is the same as password
    email: joi.string().email().required()
})

const loginValidationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
})

module.exports = {
    registerValidation: registerValidationSchema,
    loginValidation: loginValidationSchema
}