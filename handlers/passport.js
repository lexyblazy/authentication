const passport = require('passport');
const User = require('../models/user');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(User.createStrategy());

