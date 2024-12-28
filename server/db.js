const mongoose = require('mongoose');
require('dotenv').config()

const dbURL = process.env.MONGO_URL;

mongoose.connect(dbURL)
    .then(()=>{
        console.log('connection successfull !');
    }).catch((error)=>{
        console.log(`error while etablishing connection ${error}`);
    })

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 12
        
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 12
    },
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        maxLength : 20
    },
    email : { 
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password_hashed : {
        type : String,
        required : true,
        minLength : 8,
    }
});


const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

module.exports = { 
    User : mongoose.model('User',userSchema),
    Account : mongoose.model('Account',accountSchema)
} 
 