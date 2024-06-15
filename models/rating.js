const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema ({
   rating: Number,
   comment: String,
   creator:
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"user"
      }
   
})

const rating = mongoose.model("rating", ratingSchema)
module.exports = rating;