const express = require("express");
const router = express.Router({mergeParams:true});
const lists = require("../models/mongo.js");
const {ratingSchema} = require("../schema.js");
const expError = require("../utils/expError.js");
const rating = require("../models/rating.js");
const {isLoggedIn} = require("../middleware.js")

function wrapasync(fn){
    return function(req,res,next){
     fn(req,res,next).catch((err)=>next(err));
    }
}

//Route to create a review
router.post("/:id",isLoggedIn,wrapasync(async(req,res)=>{
    const {rate, comment} = req.body; 
    let joi = ratingSchema.validate(req.body);
    const id = req.params.id;
    const list = await lists.findById(id);
    const rat =  await rating.create({
        rating : rate,
        comment : comment,
        creator : req.user._id
    })
    
    list.ratings.push(rat);
    await list.save();
    req.flash("success","New Review Created");
    res.redirect(`/listing/view/${id}`);
}));

//Route to delete a review
router.post("/:id/:commentId",isLoggedIn,wrapasync(async(req,res)=>{
    const viewId= req.params.id;
    const commentId= req.params.commentId;
    review = await rating.findById(commentId);
    if(req.user && req.user._id.equals(review.creator._id)){
    const delObject = await lists.findByIdAndUpdate(viewId, {$pull:{ratings :commentId}});
    const delRating =await rating.findByIdAndDelete(commentId); 
    req.flash("success","Review deleted successfully");
    res.redirect(`/listing/view/${viewId}`); 
    }
    else{
        throw new expError(404,"You are not creator");
    }
    
}));
 
module.exports= router;