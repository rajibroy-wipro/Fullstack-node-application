const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
//const Comment = require('./models/comment');
const seedDB = require('./seeds');



seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


// ================ROUTES======================

// landing route
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({},(err, allCampgrounds) => {
        if(err){
            console.log('Error');
        }else{
            res.render('campgrounds',{campgrounds: allCampgrounds});
        }
    })
});





// new campground
app.get('/campgrounds/new',(req, res) => {
    res.render('new');
})


app.post('/campgrounds',(req, res) => {
    //  get data from form
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description}
    Campground.create(newCampground, (err, newlyCretedCampground) =>{
        if(err){
            console.log('Error!');
        }else{
            // redirect back to campground page
            res.redirect('/campgrounds'); 

        }
    });
   
})



// SHOW ROUTE

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log('error');
        }else{
            res.render('show', {foundCampground: foundCampground});
        }
    } );
})



const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`yelpcamp server has started listening at port ${PORT}`);
});