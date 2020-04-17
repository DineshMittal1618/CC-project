const mongoose=require('mongoose');
const validator=require('validator');

const User=mongoose.model('Users',{
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(! validator.isEmail(value))
                throw new Error("plz enter a valid Email");
        }},   
    password:{
            type:String,
            required:true,
            trim:true,
            validate(value){
                if(value.length<6 || value.toLowerCase().includes('password'))
                {
                    throw new Error('Plz enter a valid password')
                }
            }
        }
    }
)

module.exports=User;