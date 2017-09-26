const passport = require('passport');
const User = require('../models/user');
const crypto = require('crypto');

exports.login = passport.authenticate('local',{
    successRedirect:'/secret',
    successFlash:'You are now logged in',
    failureRedirect:'/login',
    failureFlash:'Email/Password mismatch'

})

exports.isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('error','You have to be logged in to do that');
        res.redirect('/login')
    }
}

exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','You have been logged out');
    return res.redirect('/');
}

exports.forgotForm = async (req,res)=>{
    const user = await User.findOne({'email':req.body.email});
    //if no user redirect to login page with the error
    if(!user){
        req.flash('error','No account exists for that email');
        return res.redirect('back');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + (60*60*1000);
    await user.save();
    req.flash('success',`this your password reset token ${req.headers.host}/accounts/forgot/${user.resetPasswordToken}`)
    res.redirect('back'); 
}
exports.validateToken = async (req,res,next)=>{
    const token = req.params.token;
    const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpires:{$gt:Date.now()}
    });

    if(!user){
        req.flash('error','Password token is invalid or has expired');
        return res.redirect('back');
    }
    next();
}
exports.resetForm = async (req,res)=>{
    const token = req.params.token
    res.render('reset',{title:'Reset your password',token})
}