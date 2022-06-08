var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    author:{type:Schema.Types.ObjectId,ref:"User"},
    book:{type:Schema.Types.ObjectId,ref:"User"},
    content:{type:String,require:true}
},{timestamps:true});



module.exports = mongoose.model("Comment",commentSchema);
