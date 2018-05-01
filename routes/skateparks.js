var express = require("express");
var router = express.Router();
var Skatepark = require("../models/skatepark");
var middleware = require("../middleware");



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
    var author ={
        id: req.user._id,
        username: req.user.username
    }
    var newSkatepark = {name: name, image: image, description: Description, author:author};
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
router.put("/:id",middleware.checkSkateparkOwnership, function (req, res){
    // find and update correct skatepark
    Skatepark.findByIdAndUpdate(req.params.id, req.body.skatepark, function(err, updatedSkatepark){
        if (err){
            res.redirect("/skateparks");
        } else {
            res.redirect("/skateparks/"+ req.params.id);
        }
    });
    // redirect somewhere
    
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
})




module.exports = router;