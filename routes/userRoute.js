const express=require('express')
const router=express.Router()
const {validationCheck}=require('../middlewares/dataCheckMiddleware')
const userController=require('../controllers/userController')
router.post('/register',validationCheck,userController.register)
router.post('/login',validationCheck,userController.login)

module.exports=router