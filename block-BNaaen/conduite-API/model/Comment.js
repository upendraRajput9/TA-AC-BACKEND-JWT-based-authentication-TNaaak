var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema(
  {
    body: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    articleId:{type:Schema.Types.ObjectId,req:'Article'}
  },
  { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema)
