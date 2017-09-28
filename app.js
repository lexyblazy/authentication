//requiring third party modules
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.Promise = global.Promise //tell mongoose to use ES6 promises
//requiring my own modules
const routes = require('./routes/index');
require('dotenv').config({path:'variables.env'})


//setup views and public path
const viewsPath = path.join(__dirname,'/views');
const publicPath = path.join(__dirname,'/public');
app.use(express.static(publicPath));
app.set('views',viewsPath);
app.set('view engine','pug');
app.use(expressValidator());
mongoose.connect('127.0.0.1/auth',(err)=>{
    if(err){
        console.log('Cannot to database');
        console.error(err)
    }else{
        console.log('Connection to database was successful');
    }
})


app.use(bodyParser.urlencoded({extended:true}));
app.use(flash())

//passport setup
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,

}))
app.use(passport.initialize());
app.use(passport.session());
require('./handlers/passport');
require('./handlers/mail');
app.use((req,res,next)=>{
    res.locals.user = req.user || null
    res.locals.errors = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})


//ROUTES
app.use(routes)

app.listen(process.env.PORT,()=>{
    console.log("Server is up and running ")
})