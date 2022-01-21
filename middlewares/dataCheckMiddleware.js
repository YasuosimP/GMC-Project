const {body}= require('express-validator')
exports.validationCheck=[
    body('email', 'please enter a valid email').isEmail(),
    body('password','password should be at least 6 characters').isLength({min:6})
]