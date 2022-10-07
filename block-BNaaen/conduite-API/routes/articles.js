var express = require('express');
var User = require("../model/User");
var Article = require('../model/Article')
var Comment = require('../model/Comment')
var auth = require('../middelware/auth')
var router = express.Router()

/* GET users listing. */
//protect

//all article
router.get('/',auth.optionalVerify, async function (req, res, next) {
  var limit = 20
  var offset = 0
  var favorited = ''
  var author = ''
  var tag = ''
  var articles = ''
  if (req.query.limit) {
    limit = req.query.limit
  } else if (req.query.offset) {
    offset = req.query.offset
  }
  try {
    var loginUser = await User.findById(req.user.userId);
    if (req.query.favorited) {
      favorited = req.query.favorited
      user = await User.findOne({ name: favorited }).populate('favorited')
      res.status(201).json({ articles: user.favorited })
    } else if (req.query.author) {
      author = req.query.author
      user = await User.findOne({ name: author })
      articles = await Article.find({ author: user._id })
        .limit(Number(limit))
        .skip(Number(offset))
        articles = articles.map(article=>{
          let following =loginUser?loginUser.followingList.includes(article.author.username):false
          article.author["following"]=following
          return article
        })
      res.status(201).json({ articles })
    } else if (req.query.tag) {
      tag = req.query.tag
      articles = await Article.find({ tagList: { $in: [tag] } })
        .limit(Number(limit))
        .skip(Number(offset))
        articles = articles.map(article=>{
          let following =loginUser?loginUser.followingList.includes(article.author.username):false
          article.author["following"]=following
          return article
        })
      res.status(201).json({ articles })
    } else {
      articles = await Article.find({})
        .limit(Number(limit))
        .skip(Number(offset))
        articles = articles.map(article=>{
          let following =loginUser?loginUser.followingList.includes(article.author.username):false
          article.author["following"]=following
          return article
        })
      res.status(201).json({ articles })
    }
  } catch (error) {
    next(error)
  }
})

//feed
router.get('/feed',auth.verifyToken, async function (req, res, next) {
  var limit = 20
  var offset = 0
  if (req.query.limit) {
    limit = req.query.limit
  } else if (req.query.offset) {
    offset = req.query.offset
  }
  try {
    var loginUser = await User.findById(req.user.userId);
    var article = await Article.find({}).limit(Number(limit)).skip(Number(offset));
    articles = articles.map(article=>{
      let following =loginUser?loginUser.followingList.includes(article.author.username):false
      article.author["following"]=following
      return article
    })
    res.status(201).json({ article });
  } catch (error) {
    next(error)
  }
})



//create Article
router.post('/',auth.verifyToken, async (req, res, next) => {
  try {
    var user = await User.findById(req.user.userId);
    var article = await Article.create(req.body.article)
    req.body.article.author = user.profileJson()
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//single article
router.get('/:slug',auth.optionalVerify, async function (req, res, next) {
  var slug = req.params.slug
  try {
    var loginUser = await User.findById(req.user.userId)
    var article = await Article.findOne({ slug })
    var comments = await Comment.find({articleSlug:slug})
    let following =loginUser?loginUser.followingList.includes(article.author.username):false
    article.author["following"]=following
    res.status(201).json({ article,comments })
  } catch (error) {
    next(error)
  }
})


//Edit Article
router.put('/:slug',auth.verifyToken, async (req, res, next) => {
  var slug = req.params.slug
  try {
    var loginUser = await User.findById(req.user.userId)
    var article = await Article.findOne({slug})
    if (article.author.username ==loginUser.username) {
      article = await Article.findOneAndUpdate({slug}, req.body)
    }
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//delete
router.delete('/:slug', async (req, res, next) => {
  var slug = req.params.slug
  try {
    var loginUser = await User.findById(req.user.userId)
    var article = await Article.findOne({slug})
    if (article.author.username ==loginUser.username) {
      article = await Article.findOneAndDelete(id)
      var comments = await Comment.deleteMany({ articleSlug:slug })
      res.status(201).json({ article, comments })
    }
  } catch (error) {
    next(error)
  }
})

//fovourite
router.post('/:slug/favorite',auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug
  try {
    var article = await Article.findOneAndUpdate(
      { slug },
      { $push: { favrouited: req.user.userId }},
    )
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//unfovourite
router.delete('/:slug/favorite',auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug
  try {
    var article = await Article.findOneAndUpdate(
      { slug },
      { $push: { favrouited: req.user.userId }},
    )
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//comment
//Get comments
router.get('/:slug/comments', async function (req, res, next) {
  var slug = req.params.slug
  
  try {
    var loginuser = await User.findById(req.user.userId);
    var comments = await Comment.find({articleSlug:slug})
    comments=comments.map(comment=>{
    comment.author.following= loginuser.followingList.includes(comment.author.username)
    })
    res.status(201).json({ comment })
  } catch (error) {
    next(error)
  }
})


//protected
router.use(auth.verifyToken)



//create comment
router.post('/:slug/comments', async function (req, res, next) {
  var slug = req.params.slug
  req.body.articleSlug = slug
  try {
    var user = await User.findById(req.user.userId);
    req.body.comment.author = user.profileJson()
    req.body.comment["articleSlug"]=slug
    var comment = await Comment.create(req.body.comment)
    res.status(201).json({ comment })
  } catch (error) {
    next(error)
  }
})



//delete
router.delete('/:slug/comments/:id', async function (req, res, next) {
  var commentId = req.params.id
  var slug = req.params.slug
  try {
  var article = await Article.findOne({ slug:slug})
    var loginUser = await User.findById(req.user.userId)
  var  comment = await Comment.findById(commentId)
    if (loginUser.username === article.author.username||loginUser.username===comment.author.username) {
      comment = await Comment.findByIdAndDelete(commentId)
    }
    res.status(201).json({ comment })
  } catch (error) {
    next(error)
  }
})


module.exports = router
