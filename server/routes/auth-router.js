const express = require('express')
const router = express.Router()


router.post('/register', (req, res) => {
    req.app.locals.authController.registerUser(req, res);
});

router.post('/login', (req, res) => {
    req.app.locals.authController.loginUser(req, res);
});

router.get('/logout', (req, res) => {
    req.app.locals.authController.logoutUser(req, res);
});

router.get('/loggedIn', (req, res) => {
    req.app.locals.authController.getLoggedIn(req, res);
});

module.exports = router