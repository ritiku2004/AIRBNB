const mongoose = require("mongoose");
const list = require("../models/mongo.js");
const datalist = require("./data.js");

async function main(){
 await  mongoose.connect('mongodb://127.0.0.1:27017/project');
}

main()
.then(()=>{
    console.log("connection established");
} 
)
.catch(err=>console.log(err));

async function ls(){
    await list.deleteMany({});
    datalist.data = datalist.data.map((obj)=> ({
       ...obj,
       owner : "665ee0ac76c6529dac35cb57"
    }));
   await list.insertMany(datalist.data);
   console.log("Data saved");
}
ls();
