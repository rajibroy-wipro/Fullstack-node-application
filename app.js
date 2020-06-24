const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User  = require('./models/user');
const seedDB = require('./seeds');


// requiring routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');
const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp" ;

console.log(url);
// mongoose config for warning
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//  mongodb+srv://arvind:22@Arvind@yelpcamp-1vbii.mongodb.net/yelpcamp?retryWrites=true&w=majority
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR:', err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//seed the db
//seedDB();


// PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'Tater is the cutest dog!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// middlewre for handling login logout links logic in header
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`yelpcamp server has started listening at port ${PORT}`);
});