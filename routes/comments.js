const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// we require a directory it will look for index file
const middleware = require('../middleware');



// comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {foundCampground: foundCampground});
        }
    });
 });
 
//  comments save
 router.post('/', middleware.isLoggedIn, (req, res) => {
         // look campground using ID
     Campground.findById(req.params.id, (err, foundCampground) => {
         if(err){
             console.log(err);
             res.redirect('/campgrounds');
         }else{
             // create new comment
             Comment.create(req.body.comment, (err, newCreatedComment) => {
                 if(err){
                    req.flash('error', 'Something went wrong, please try again later');
                    console.log(err);
                 }else{
                    //add username and id to comment 
                    newCreatedComment.author.id = req.user._id;
                    newCreatedComment.author.username = req.user.username;
                    // save comment
                    newCreatedComment.save();
                     // connect new comment to campground
                    foundCampground.comments.push(newCreatedComment);
                    foundCampground.save();
                    // redirect to campground show page
                    req.flash('success', 'Comment created');
                    res.redirect('/campgrounds/' + foundCampground._id);    
                 }
             });
         }
     });
 });
       
// edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit', {campground_id: req.params.id, comment:foundComment}); 
        }
    });
});
 
// update comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

// Comment Destroy  route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    //find by id and remove 
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
}); 


module.exports = router;