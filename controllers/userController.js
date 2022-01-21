const User=require('../modules/userModel')
const bcrypt=require('bcrypt')
const config= require ('config')
const jwt= require ('jsonwebtoken')
const {validationResult}=require('express-validator')
const register=async(req,res)=> {
     try{
        const errors=validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({errors:errors.mapped()})
const{firstname,lastname,email,password}=req.body
        const user=await User.findOne({email})
        if (user) return res.status(400).json({errors:[{msg:'user already exists!'}]})
        const newUser=new User({firstname,lastname,email,password})
        //password crypting 
        const salt=await bcrypt.genSalt(10)
        const hash=await bcrypt.hash(newUser.password,salt)
        newUser.password=hash
        const registeredUser=await newUser.save()
        // const token=jwt.sign({payload},secret-key)
        const payload={sub:registeredUser._id}
        const token=await jwt.sign(payload,config.get("JWT_CONFIG.SECRET"))
        res.json({token})
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}
const login=async(req,res)=>{
    try {
        const{email,password}=req.body
        const user=await User.findOne({email})
        if (!user) return response.status(400).json({errors:[{msg:'please register before'}]})
        const isMatch=await  bcrypt.compare(password,User.password)
        if(!isMatch) return res.status(400).json({errors:[{msg:'wrong password'}]})
        const payload={
            sub:user._id
            
        }
        const token=await jwt.sign(payload,config.get("JWT_CONFIG.SECRET"))
        res.json({token})
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})

    }
}

module.exports={register,login}