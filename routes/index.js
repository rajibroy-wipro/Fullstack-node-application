const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


// middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// landing route
router.get('/', (req, res) => {
    res.render('landing');
});



//show register form
router.get('/register', (req, res) => {
    res.render('register');
})

// handle signup logic
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, newlyCreatedUser) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () =>{
            res.redirect('/campgrounds');
        });
    });
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});


// handling login logic
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
});

//Logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/campgrounds');
});


module.exports = router;