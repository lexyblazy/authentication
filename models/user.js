const validator = require('validator');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseErrors = require('mongoose-mongodb-errors');
mongoose.Promise = global.Promise //tell mongoose to use ES6 promises
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:"You must supply an email",
        trim:true,
        unique:"A user with that email already exists"
    },
    name:{
        type:String,
        trim:true,
        required:"You must supply your name"
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date
})

userSchema.plugin(mongooseErrors);
userSchema.plugin(passportLocalMongoose,({usernameField:'email'}));
module.exports = mongoose.model('User',userSchema);