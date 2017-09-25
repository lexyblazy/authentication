const passport = require('passport');
const User = require('../models/user');

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