var express = require('express');
var auth = require("../middelware/auth")
var Article = require("../model/Article")
var router = express.Router();

/* GET home page. */
//filter by tags
router.use(auth.verifyToken)
router.get('/tags', async function (req, res, next) {
  try {
    var articles = await Article.find({})
    var tags = articles.map(elm=>elm.tagList).flat().filter((tag,i,self)=>self.indexOf(tag)===i)
    res.status(201).json({tags})
  } catch (error) {
    next(error)
  }
})

module.exports = router;
