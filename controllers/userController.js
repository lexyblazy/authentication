const User = require('../models/user');
const promisify = require('es6-promisify');
const passport = require('passport');
const crypto = require('crypto');
const mail = require('../handlers/mail')

//show the register form
exports.registerForm = (req,res)=>{
    res.render('register',{title:'Signup'})
}

exports.validateRegister = (req,res,next)=>{
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('password','Password field cannot be empty').notEmpty();
    req.checkBody('confirm-password','Passwords do not match').equals(req.body.password);
    req.sanitizeBody('email').normalizeEmail({
        remove_dots:false,
        remove_extendsion:false,
        gmail_remove_subaddress:false
    })

    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg))
        return res.redirect('/register')
    }
    next();

}

exports.register = async (req,res,next)=>{
 
    const newUser = {
        name: req.body.name,
        email:req.body.email 
    }
    const register = promisify(User.register,User);
    await register(newUser,req.body.password);
    console.log('User has been registered')
    next();
    
}

exports.loginForm = (req,res)=>{
    res.render('login',{title:"Login"});
}

exports.validateLogin = (req,res,next)=>{
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('email','Email field cannot be empty').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots:false,
        remove_extension:false,
        gmail_remove_subaddress:false
    });
    req.checkBody('password','Password field cannot be blank').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('/login');
    }
    next();
}

exports.validateForgotPassword = (req,res,next)=>{
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('email','Email field cannot be empty').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots:false,
        remove_extension:false,
        gmail_remove_subaddress:false
    });
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('/login');
    }
    next();
}

exports.confirmPassword = (req,res,next)=>{
    req.checkBody('password','Password cannot be empty').notEmpty();
    req.checkBody('confirm-password','Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if(errors){
        req.flash('error',errors.map(err=>err.msg));
        return res.redirect('back');
    }
    next();
}

exports.resetPassword = async (req,res)=>{

    const token = req.params.token;
    const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpires:{$gt:Date.now()}
    });

    if(!user){
        req.flash('error','Password token is invalid or has expired');
        return res.redirect('back');
    }
    const setPassword = promisify(user.setPassword,user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined,
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    const login = promisify(req.login,req);
    login(updatedUser);
    req.flash('success','Password reset succesful,You have been logged in');
    res.redirect('/secret');
}



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
    const resetURL = `${req.headers.host}/accounts/forgot/${user.resetPasswordToken}`;
    const options = {
        user,
        subject:"Password Link for your account",
        resetURL,
        fileName:"password-reset"
    }
    await mail.send(options)
    req.flash('success',`Password reset token has been sent to your email`)
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