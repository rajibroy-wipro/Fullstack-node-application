const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');



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
            req.flash('error', err.message);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, () =>{
            req.flash('success',`Welcome to YelpCamp, Nice to see You ${newlyCreatedUser.username}`);
            res.redirect('/campgrounds');
        });
    });
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});


// handling login logic
router.post('/login', (req, res, next) => {
    passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: `Welcome back ${req.body.username} !` 
    })(req, res);
});    

//Logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Logged You Out!');
    res.redirect('/campgrounds');
});


module.exports = router;