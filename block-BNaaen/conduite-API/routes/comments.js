var express = require('express')
var auth = require('../middelware/auth')
var Comment = require('../model/Comment')
var Article = require('../model/Article')
var router = express.Router()

/* GET home page. */
//protected
router.use(auth.verifyToken)

//create comment
router.post('/:slug/comments', async function (req, res, next) {
  req.body.articleId = req.params.slug
  try {
    var user = await User.findById(req.user.userId);
    req.body.comment.author = user.userJson()
    var comment = await Comment.create(req.body.comment)
    var article = await Article.findByIdAndUpdate(req.body.articleId, {
      $push: { comment: commentId },
    })
    res.status(201).json({ comment })
  } catch (error) {
    next(error)
  }
})

//edit
router.put('/:id', async function (req, res, next) {
  var commentId = req.params.id
  try {
    var comment = await Comment.find(commentId)
    if (req.user.userId == comment.author) {
      comment = await Comment.findByIdAndUpdate(comment.author, req.body)
    }
    res.status(201).json({ comment })
  } catch (error) {
    next(error)
  }
})

//delete
router.delete('/:id', async function (req, res, next) {
  var commentId = req.params.id
  try {
    var comment = await Comment.find(commentId)
    if (req.user.userId == comment.author) {
      var article = await Article.findByIdAndUpdate(comment.articleId, {
        $pull: { comment: commentId },
      })
      comment = await Comment.findByIdAndDelete(commentId)
    }
    res.status(201).json({ comment })
  } catch (error) {
    next(error)
  }
})

module.exports = router
