var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Skatepark   = require("./models/skatepark"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost/yelp_skate");
app.use(bodyParser.urlencoded({extended: true}));
app.set ("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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






app.get("/", function(req, res){
  res.render("landpage");
});
// Index - show all Skateparks
app.get("/skateparks", function(req, res){
//   get all skateparks from database

   Skatepark.find({}, function(err, Skatepark){
         if(err){
             console.log(err);
         } else {
         res.render("skateparks/index", {skateparks:Skatepark});
        //  console.log ("Newly Created Skatepark: ");
        //  console.log(Skatepark);
         }
     });
   
   

});
// Create - add new skatepark to DB
app.post("/skateparks", function (req, res){
    // get data from form and add to skateparks arrary
    var name = req.body.name;
    var image = req.body.image;
    var Description= req.body.description;
    var newSkatepark = {name: name, image: image, description: Description};
    Skatepark.create(newSkatepark , function(err, newlyCreatedSkatepark){
        if(err){
            console.log(err);
        } else{    
        res.redirect("/skateparks");
        }
    });

     // redirect back to skateparks page
});

// New- show form to create new skatepark
app.get("/skateparks/new", function(req,res){
    res.render("skateparks/new");
});


// Show -shows more info about selected skatepark
app.get("/skateparks/:id", function(req, res){
    //find the campground with provided ID
    Skatepark.findById(req.params.id).populate("comments").exec(function(err, foundSkatepark){
        if(err){
            console.log(err);
        } else {
            console.log(foundSkatepark);
            //render show template with that campground
            res.render("skateparks/show", {skatepark: foundSkatepark});
        }
    });
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/skateparks/:id/comments/new", isLoggedIn ,function(req, res){
    // 
    Skatepark.findById(req.params.id, function (err , skatepark){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {skatepark: skatepark})
            }
    });
});

app.post("/skateparks/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Skatepark.findById(req.params.id, function(err, skatepark){
       if(err){
           console.log(err);
           res.redirect("/skateparks");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               skatepark.comments.push(comment);
               skatepark.save();
               res.redirect('/skateparks/' + skatepark._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to skatepark
   //redirect skatepark show page
});




// =============
// auth routes
// =============

// show resgister form

app.get("/register", function(req, res) {
    res.render("register");
});
// handles sign up form logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function (err , user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/skateparks");
        });
    });
});

//show login form

app.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic

app.post("/login", passport.authenticate("local",
    {
        successRedirect:"/skateparks",
        failureRedirect:"/login",
    }), function(req, res) {
    res.send("login logic happens here!");
});


app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/skateparks");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}





app.listen(process.env.PORT, process.env.IP , function(req, res){
    console.log("Server up and running");
});
