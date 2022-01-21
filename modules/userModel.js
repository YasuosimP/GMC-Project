const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    firstname:String,
    lastname:String,
    email:{
        type:String,
        required:true ,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    }

})
module.exports=User=mongoose.model('user',userSchema)