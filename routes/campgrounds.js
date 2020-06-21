const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');



// middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// all campground
router.get('/', (req, res) => {
    Campground.find({},(err, allCampgrounds) => {
        if(err){
            console.log('Error');
        }else{
            res.render('campgrounds/campgrounds',{campgrounds: allCampgrounds});
        }
    })
});




// new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


// new campground save to db
router.post('/', isLoggedIn, (req, res) => {
    //  get data from form
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: description, author: author}
    Campground.create(newCampground, (err, newlyCretedCampground) =>{
        if(err){
            console.log('Error!');
        }else{
            // redirect back to campground page
            console.log(newlyCretedCampground);
            res.redirect('/campgrounds'); 
        }
    });
   
})



// SHOW ROUTE

router.get('/:id', (req, res) => {
    // find the campground with provided id but we are only getting id's of comments from it and we need comments also we will populate the comment in campground
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err){
            console.log('error');
        }else{
            res.render('campgrounds/show', {foundCampground: foundCampground});
        }
    } );
});


//EDit campground
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            res.redirect('/camgrounds');
        }else{
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

//Update campground
router.post('/:id', (req, res) => {
    //find and update the correct campground and redirect
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect('/campground/'+ req.params.id);
        }
    }); 
});


module.exports = router;