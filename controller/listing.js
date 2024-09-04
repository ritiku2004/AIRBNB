const express = require("express");
const lists = require("../models/mongo.js");
const {listSchema} = require("../schema.js");
const expError = require("../utils/expError.js");
const mapKey = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapKey });

 
module.exports.index = (async function (req,res){
    const data = await lists.find({}); 
    if(data.length==0) throw new expError(404,"list is empty");
    else  
    res.render("index",{data}); 
}); 

module.exports.view = (async (req,res)=>{
    const id = req.params.id;
    const idvalue = await lists.findOne({_id: id}).populate({path:"ratings", populate:{path:"creator"}}).populate("owner").catch(()=>{throw new expError(404,"Undefined id show")});
    if(!idvalue) throw new expError(404,"Undefined id for Show");
    else res.render("view",{idvalue}); 
});

module.exports.del = (async (req,res)=>{
    const id = req.params.id;
    const list = await lists.findOne({_id: id});

    if (req.user && list.owner[0]._id.equals(req.user._id)){
    const del = await lists.findOneAndDelete({_id: id},{new:true}).catch(()=>{throw new expError(404,"Undefined id for Delete")});
    }else
    throw new expError(404,"You are not owner");
    req.flash("success","Listing deleted successfully");
    res.redirect("/listing");
});

module.exports.editget = (async (req,res)=>{
    const id = req.params.id;
    const idvalue = await lists.findOne({_id: id}).catch(()=>{throw new expError(404,"Undefined id for Edit")});
    if(!idvalue) throw new expError(404,"Undefined id for Edit");
    res.render("edit",{idvalue});
})

module.exports.editpost = (async (req,res)=>{
    const id = req.params.id;
    const list = await lists.findOne({_id: id});
    let joi = listSchema.validate(req.body);
    if(joi.error) throw new expError(401,"field required");

    const url = req.file.path || req.body.image.url;
    const filename = req.file.filename || req.body.image.url;
    const {title, description, price, location, country } = req.body;
    let response = await geocodingClient
    .forwardGeocode({ 
        query: location,
        limit: 1
      }).send()
    if (req.user && list.owner[0]._id.equals(req.user._id)){
    const idvalue = await lists.findOneAndUpdate({_id: id},{title:title, description:description, image: {
        filename : filename,
        url: url
        }, 
        price:price,
        location:location, 
        country:country,
        geometry: response.body.features[0].geometry
    });
    }else{
        throw new expError(404,"You are not owner");
    }
    req.flash("success","Listing edited successfully");
    res.redirect(`/listing/view/${id}`);
})

module.exports.createget = (req,res)=>{
    res.render("create");
}

module.exports.createpost = ( async (req,res)=>{
    const {title, description, price, location, country } = req.body;
    let joi = listSchema.validate(req.body);
    if(joi.error) throw new expError(401,"field required");

    //forward geo coding -

    let response = await geocodingClient
    .forwardGeocode({
        query: location,
        limit: 1
      }).send()

    const url = req.file.path;
    const filename = req.file.filename;
    let newlist = await lists.create({
        title,
        description,
        image: {
            filename : filename,
            url: url
           },
        price,
        location,
        country
    });
    newlist.owner.push(req.user);
    newlist.geometry = response.body.features[0].geometry;
    await newlist.save();
    let id = newlist._id;
    req.flash("success","New Listing Created");
    res.redirect(`/listing/view/${id}`);
})

module.exports.price = (async function (req,res){
    const data = await lists.find({});
    if(data.length==0) throw new expError(404,"list is empty");
    else 
    res.render("price",{data});
})