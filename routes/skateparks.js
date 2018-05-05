var express = require("express");
var router = express.Router();
var Skatepark = require("../models/skatepark");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);



// Index - show all Skateparks
router.get("/", function(req, res){
//   get all skateparks from database

   Skatepark.find({}, function(err, foundSkatepark){
         if(err){
             console.log(err);
         } else {
         res.render("skateparks/index", {skateparks: foundSkatepark});
        //  console.log ("Newly Created Skatepark: ");
        //  console.log(Skatepark);
         }
     });
   
   

});
// Create - add new skatepark to DB
router.post("/", middleware.isLoggedIn, function (req, res){
    // get data from form and add to skateparks arrary
    var name = req.body.name;
    var image = req.body.image;
    var Description= req.body.description;
    var Price = req.body.price
    var author ={
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newSkatepark = {name: name, image: image, description: Description, price: Price, author:author,location: location, lat: lat, lng: lng};
    Skatepark.create(newSkatepark , function(err, newlyCreatedSkatepark){
        if(err){
            console.log(err);
        } else{    
        res.redirect("/skateparks");
        }
    });

     // redirect back to skateparks page
});
});
// New- show form to create new skatepark
router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("skateparks/new");
});


// Show -shows more info about selected skatepark
router.get("/:id", function(req, res){
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


// edit skatepark route
router.get("/:id/edit",middleware.checkSkateparkOwnership, function(req, res){
        Skatepark.findById(req.params.id, function(err, foundSkatepark){
                res.render("skateparks/edit", {skatepark: foundSkatepark});
            });
});



// update skatepark route
router.put("/:id", middleware.checkSkateparkOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.skatepark.lat = data[0].latitude;
    req.body.skatepark.lng = data[0].longitude;
    req.body.skatepark.location = data[0].formattedAddress;

    Skatepark.findByIdAndUpdate(req.params.id, req.body.skatepark, function(err, skatepark){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/skateparks/" + req.params.id);
        }
    });
  });
});



// Destroy Skatepark Route
router.delete("/:id",middleware.checkSkateparkOwnership, function(req,res){
    Skatepark.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/skateparks");
        } else {
            res.redirect("/skateparks");
        }
    });
});




module.exports = router;