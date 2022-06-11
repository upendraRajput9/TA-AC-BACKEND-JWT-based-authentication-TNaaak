var mongoose = require("mongoose");
var slug = require('slug');

var Schema = mongoose.Schema;


var articleSchema = new Schema({
title:{type:String,required:true},
slug:{type:String},
description: {type:String,required:true},
tagList:[String],
likes:[{type:Schema.Types.ObjectId,ref:"User"}],
author:{type:Schema.Types.ObjectId,ref:"User"},
favorited:{type:Boolean,default:false},
favoritesCount:{type:Number,default:0},
comment:[{type:Schema.Types.ObjectId,ref:"Comment"}]
},{timestamps:true});

articleSchema.pre("save",async function(next){
    if(this.title){
        this.slug = await slug(this.title,"-")
    }
})



module.exports = mongoose.model("Article",articleSchema)