module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.RedirectUrl= req.originalUrl;
        req.flash("error","you must be logged in.")
        res.redirect("/auth/login");
    }
    else next();
}
module.exports.saveRedirecturl=(req,res,next)=>{
    const url = req.session.RedirectUrl || "/listing";
    if (url){
     res.locals.RedirectUrl=url;
    }
next();
}