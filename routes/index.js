const router = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {catchErrors} = require('../handlers/errorhandlers')

router.get('/',(req,res)=>{
    res.render('index',{title:"Home page"});
})

router.get('/secret',authController.isLoggedIn,(req,res)=>{
    res.render('secret',{title:"Secret Page"});
})

router.get('/register',userController.registerForm);
router.post('/register',
            userController.validateRegister,
            catchErrors(userController.register),
            authController.login);
router.get('/login',userController.loginForm);
router.post('/login',userController.validateLogin, authController.login);
router.get('/logout',authController.logout)

module.exports = router;