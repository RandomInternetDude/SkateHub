var express = require("express");
var router = express.Router({mergeParams:true});
var Skatepark = require("../models/skatepark");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn ,function(req, res){
    // 
    Skatepark.findById(req.params.id, function (err , skatepark){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {skatepark: skatepark})
            }
    });
});

router.post("/", isLoggedIn, function(req, res){
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
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
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
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;