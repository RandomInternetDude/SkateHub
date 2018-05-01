var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Skatepark   = require("./models/skatepark"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
var commentRoutes   = require("./routes/comments"),
    skateparkRoutes = require("./routes/skateparks"),
    indexRoutes     = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_skate");
app.use(bodyParser.urlencoded({extended: true}));
app.set ("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// passport configuration
app.use(require("express-session")({
    secret:"once again colt talks about rusty his sausage looking dog",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/",indexRoutes);
app.use("/skateparks", skateparkRoutes);
app.use("/skateparks/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP , function(req, res){
    console.log("Server up and running");
});
