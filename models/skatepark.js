var mongoose = require("mongoose");

var skateparkSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: String,
   location: String,
   lat: Number,
   lng: Number,
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },

   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Skatepark", skateparkSchema);