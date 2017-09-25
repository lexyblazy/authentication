const User = require('../models/user');
const promisify = require('es6-promisify');

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