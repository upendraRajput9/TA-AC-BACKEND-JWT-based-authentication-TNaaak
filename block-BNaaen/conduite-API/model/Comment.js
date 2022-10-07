var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema(
  {
    body: { type: String },
    author: { 
      username:String,
      bio:String,
      image:String,
      followingList: [String]
    },
    articleSlug: { type: String }
  },
  { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema)
