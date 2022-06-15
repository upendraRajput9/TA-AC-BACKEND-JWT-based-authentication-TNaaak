var express = require('express');
var User = require("../model/User");
var Article = require('../model/Article')
var Comment = require('../model/Comment')
var auth = require('../middelware/auth')
var router = express.Router()

/* GET users listing. */
//protect
router.use(auth.verifyToken)

//all article
router.get('/', async function (req, res, next) {
  var limit = 20
  var offset = 0
  var favorited = ''
  var author = ''
  var tag = ''
  var arrticles = ''
  if (req.query.limit) {
    limit = req.query.limit
  } else if (req.query.offset) {
    offset = req.query.offset
  }
  try {
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
      res.status(201).json({ articles })
    } else if (req.query.tag) {
      tag = req.query.tag
      articles = await Article.find({ tagList: { $in: [tag] } })
        .limit(Number(limit))
        .skip(Number(offset))
      res.status(201).json({ articles })
    } else {
      articles = await Article.find({})
        .limit(Number(limit))
        .skip(Number(offset))
      res.status(201).json({ articles })
    }
  } catch (error) {
    next(error)
  }
})

//feed
router.get('/feed', async function (req, res, next) {
  var limit = 20
  var offset = 0
  if (req.query.limit) {
    limit = req.query.limit
  } else if (req.query.offset) {
    offset = req.query.offset
  }
  try {
    var article = await Article.find({}).limit(Number(limit)).skip(Number(offset));
    res.status(201).json({articles});
  } catch (error) {
    next(error)
  }
})



//create Article
router.post('/', async (req, res, next) => {
  req.body.author = req.user.userId
  try {
    var article = await Article.create(req.body)
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//single article
router.get('/:slug', async function (req, res, next) {
  var slug = req.params.slug
  try {
    var article = await Article.findOne({ slug }).populate('comment')
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//filter by tags
router.get('/:tags/tags', async function (req, res, next) {
  var tags = req.params.tags
  try {
    var articles = await Article.find({ tagList: tags }).populate('comment')
    res.status(201).json({ articles })
  } catch (error) {
    next(error)
  }
})

//like article
router.get('/:articleId/likes', async (req, res, next) => {
  var id = req.params.articleId
  try {
    var article = await Article.findByIdAndUpdate(id, {
      $push: { likes: req.user.userId },
    })
    res.status(201).json({ article: article.likes.length })
  } catch (error) {
    next(error)
  }
})
module.exports = router

//delete
router.get('/:id/delete', auth.verifyToken, async (req, res, next) => {
  var id = req.params.id
  try {
    var article = await Article.findByIdAndUpdate(id, {
      $pull: { likes: req.user.userId },
    })
    res.status(201).json({ article: article.likes.length })
  } catch (error) {
    next(error)
  }
})

//Edit Article
router.put('/:id/edit', async (req, res, next) => {
  var id = req.params.id
  try {
    var article = await Article.findById(id)
    if (article.author == req.user.userId) {
      article = await Article.findByIdAndUpdate(id, req.body)
    }
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//delete
router.delete('/:id/delete', async (req, res, next) => {
  var id = req.params.id
  try {
    var article = await Article.findById(id)
    if (article.author == req.user.userId) {
      article = await Article.findByIdAndDelete(id)
      var comments = await Comment.deleteMany({ articleId: id })
      res.status(201).json({ article, comments })
    }
  } catch (error) {
    next(error)
  }
})

//Unfovourite
router.post('/:slug/favorite', async (req, res, next) => {
  let slug = req.params.slug
  try {
    var article = await Article.findOneAndUpdate(
      { slug },
      { $pull: { favrouited: req.user.userId } },
    )
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

module.exports = router
