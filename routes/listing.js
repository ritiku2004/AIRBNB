const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middleware.js")
const multer = require("multer");
const {index,view,del, editget, editpost,createget,createpost,price} = require("../controller/listing.js")
const {storage}=require("../config.js");
const upload = multer({storage})


//wrapasync fn for error handling in async fn
function wrapasync(fn){
    return function(req,res,next){
     fn(req,res,next).catch((err)=>next(err));
    }
}

//index route
router.get("/", wrapasync(index));


//Price index route 
router.get("/price",wrapasync(price));
 
 // show route
 router.get("/view/:id" , wrapasync(view));
 
//Delete Route
router.get("/delete/:id",isLoggedIn, wrapasync(del));

//Edit form Route
router.get("/edit/:id",isLoggedIn, wrapasync(editget));

//Edit request route
router.post("/edit/:id",isLoggedIn,upload.single('url'), wrapasync(editpost));

//Create form route
router.get("/create",isLoggedIn,createget);

//Create request route
router.post("/create",isLoggedIn,
    upload.single('url'),
    wrapasync(createpost));
    

module.exports = router;