const express = require("express");
const router = express.Router();
const passport= require("passport");
const LocalStrategy = require('passport-local');
const User = require("../models/user.js")
const {saveRedirecturl}= require("../middleware.js");

//wrapasync fn for error handling in async fn
function wrapasync(fn){
    return function(req,res,next){
     fn(req,res,next).catch((err)=>{req.flash("error","User already exists"); res.redirect("/auth/signup"); });
    }
}

passport.use(new LocalStrategy(User.authenticate()));       
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

router.get("/signup",(req,res)=>{
    res.render("signup");
})

router.post("/signup",wrapasync(async(req,res,next)=>{
    const {mail, username, password} = req.body;
    let user = new User({
        email:mail,
        username: username
    })
    let regUser = (await User.register(user,password));
    req.login(regUser,(err)=>{
        if(err) next(err);
        else {
            req.flash("success", "You are successfully signed up")
            res.redirect("/listing");
        }
    })
})) 

router.get("/login",(req,res)=>{
    res.render("login");
})

router.post("/login",saveRedirecturl,
    passport.authenticate("local",{
        failureRedirect:"/auth/login",
        failureFlash:true,
    }), 
    (req,res)=>{
        req.flash("success","You are logged in");
        res.redirect(res.locals.RedirectUrl);
    }
)

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You are logged out.");
            res.redirect("/listing");
        }
    });
})

module.exports= router;