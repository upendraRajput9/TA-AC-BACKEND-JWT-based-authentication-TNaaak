var express = require('express')
var Article = require('../model/Article')
var Comment = require('../model/Comment')
var auth = require('../middelware/auth')
var router = express.Router()

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    var articles = await Article.find({}).populate('comment')
    res.status(201).json({ articles })
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
  var tags = req.params.tags;
  try {
    var articles = await Article.find({tagList}).populate('comment')
    res.status(201).json({ articles })
  } catch (error) {
    next(error)
  }
})
//protect
router.use(auth.verifyToken)

//create Article
router.post('/', async (req, res, next) => {
  req.body.author = req.user.userId
  req.body.tags = req.body.tags.split(' ')
  try {
    var article = await Article.create(req.body)
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
})

//like article
router.get('/:id/likes', async (req, res, next)=>{
  var id = req.params.id
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
router.get('/:id/delete', auth.verifyToken, async (req, res, next)=>{
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
  req.body.tags = req.body.tags.split(' ')
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
router.put('/:id/delete', async (req, res, next) => {
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
});



module.exports = router
