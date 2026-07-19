const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type : String,
        required : true,
        unique : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required :  true,
    },
    role : {
        type : String,
        default : 'user',
    },
    phoneNumber : {
        type: String,
        required : false,
    },
    DOB :{
        type : Date,
        required : false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model('User',UserSchema);

module.exports = User;

