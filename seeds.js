var mongoose = require("mongoose");
var Skatepark = require("./models/skatepark");
var Comment   = require("./models/comment");

var data = [];

function seedDB(){
   //Remove all campgrounds
   Skatepark.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed skateparks!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Skatepark.create(seed, function(err, skatepark){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a skatepark");
                        //create a comment
                        Comment.create(
                            {}, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    skatepark.comments.push(comment);
                                    skatepark.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
}
 
module.exports = seedDB;