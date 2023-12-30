var mongoose = require("mongoose");
var Skatepark = require("./models/skatepark");
var Comment = require("./models/comment");

var data = []; // Assuming you have your seed data here

async function seedDB() {
    try {
        // Remove all skateparks
        await Skatepark.deleteMany({});
        console.log("removed skateparks!");

        // Remove all comments
        await Comment.deleteMany({});
        console.log("removed comments!");

        // Add a few skateparks
        for (let seed of data) {
            let skatepark = await Skatepark.create(seed);
            console.log("added a skatepark");

            // Create a comment
            let comment = await Comment.create({});
            skatepark.comments.push(comment);
            await skatepark.save();
            console.log("Created new comment");
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = seedDB;
