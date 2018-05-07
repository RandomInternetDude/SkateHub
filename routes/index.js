var express = require("express");
var router = express.Router();
var passport = require ("passport");
var User = require("../models/user");

router.get("/", function(req, res){
  res.render("landpage");
});



// show resgister form

router.get("/register", function(req, res) {
    res.render("register");
});
// handles sign up form logic
router.post("/register", function(req, res) {
    var newUser = new User(
        {
            username: req.body.username, 
            firstname: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar,
            
        });
    // if (req.body.adminCode === "secretCode420"){
    //     newUser.isAdmin = true;
    // }
    User.register(newUser,req.body.password, function (err , user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to SkateHub " + user.username);
            res.redirect("/skateparks");
        });
    });
});

//show login form

router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic

router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/skateparks",
        failureRedirect:"/login",
    }), function(req, res) {
});


router.get("/logout", function(req, res) {
    req.flash("success", "Logged you out!");
    req.logout();
    res.redirect("/skateparks");
});

// user profile route
router.get("/user/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if (err){
           req.flash("error", "Something went wrong.")
           res.redirect("/skateparks");
       }
       res.render("users/show", {user: foundUser});
   }); 
});
 



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;