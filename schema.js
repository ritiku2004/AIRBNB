//Joi server side schema validation for listings.
const joi = require("joi");
module.exports.listSchema= joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        filename:joi.string(),  
        location:joi.string().required(),
        price:joi.number().required().min(0),
        country:joi.string().required(),
        url:joi.string().allow("",null),
});

//Joi server side schema validation for reviews.
module.exports.ratingSchema= joi.object({
        rating:joi.string(),
        comment:joi.string().required(),
});