const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');





// middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


// comments new
router.get('/new', isLoggedIn, (req, res) => {
    //find by id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render('comments/new', {foundCampground: foundCampground});
        }
    });
 });
 
//  comments save
 router.post('/', isLoggedIn, (req, res) => {
         // look campground using ID
     Campground.findById(req.params.id, (err, foundCampground) => {
         if(err){
             console.log(err);
             res.redirect('/campgrounds');
         }else{
             Comment.create(req.body.comment, (err, newCreatedComment) => {
                 if(err){
                     console.log(err);
                 }else{
                     newCreatedComment.author.id = req.user._id;
                     newCreatedComment.author.username = req.user.username;
                     newCreatedComment.save();
                     //add username and id to comment
                    // save comment
                    //comment.save();
                    foundCampground.comments.push(newCreatedComment);
                    foundCampground.save();
                    console.log(newCreatedComment);
                    res.redirect('/campgrounds/' + foundCampground._id);    
                 }
             });
             // create new comment
             // connect new comment to campground
             // redirect to campground show page 
         
         }
     });
 });
       
 
module.exports = router;