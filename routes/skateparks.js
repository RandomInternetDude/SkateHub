var express = require("express");
var router = express.Router();
var Skatepark = require("../models/skatepark");


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
router.post("/", function (req, res){
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
router.get("/new", function(req,res){
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

module.exports = router;