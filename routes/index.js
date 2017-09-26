const router = require('express').Router();
const userController = require('../controllers/userController');

const {catchErrors} = require('../handlers/errorhandlers')
//the home page
router.get('/',(req,res)=>{
    res.render('index',{title:"Home page"});
})
//the secret page, You can only see this page if your are loggedin
router.get('/secret',userController.isLoggedIn,(req,res)=>{
    res.render('secret',{title:"Secret Page"});
})
//the register and login routes
router.get('/register',userController.registerForm);
router.post('/register',
            userController.validateRegister,
            catchErrors(userController.register),
            userController.login);
router.get('/login',userController.loginForm);
router.post('/login',userController.validateLogin, userController.login);
router.get('/logout',userController.logout)

//the password reset flow routes
router.post('/accounts/forgot',userController.validateForgotPassword, catchErrors(userController.forgotForm));
router.get('/accounts/forgot/:token',
            catchErrors(userController.validateToken),
            catchErrors(userController.resetForm)
        );
router.post('/accounts/forgot/:token',
            userController.confirmPassword,
            catchErrors(userController.validateToken),
            catchErrors(userController.resetPassword)
        )


module.exports = router;