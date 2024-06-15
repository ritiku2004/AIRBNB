const express = require("express");
const app = express();
const session = require("express-session");

const object = {
    secret:"tanu",
    resave:false,
    saveUninitilazed: true,
}
app.use(session(object));
app.get("/register",(req,res)=>{
  let name = req.query.name;
  req.session.name = name;
  res.redirect("/show");
})

app.get("/show",(req,res)=>{
    res.send(`hello ${req.session.name}`);
})

app.listen(8080);