// all the middleware goes here
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err){
                req.flash('error', 'Campground not find');
                res.redirect('back');
            }else{
                //does user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error', 'You must be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                res.redirect('back');
            }else{
                //does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error', 'You must be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    console.log('changes');
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must be logged in to do that');
    res.redirect('/login');
}    

module.exports = middlewareObj;

