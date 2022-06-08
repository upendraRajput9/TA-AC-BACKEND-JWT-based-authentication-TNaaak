var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bookSchema = new Schema({
    creater:{type:Schema.Types.ObjectId,ref:"User"},
    title:{type:String,required:true},
    categories:[String],
    price:{type:Number},
    quantity:{type:Number,min:1},
    comment:[{type:Schema.Types.ObjectId,ref:"Comment"}]
},{timestamps:true});



module.exports = mongoose.model("Book",bookSchema);

