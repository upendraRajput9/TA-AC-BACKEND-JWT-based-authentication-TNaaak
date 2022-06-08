var express = require('express');
var auth = require('../middleware/auth');
const Book = require('../model/Book');
const User = require('../model/User');
var Comment = require("../model/Comment")
var router = express.Router();

/* GET users listing. */
router.get('/',async  function(req, res, next) {
  try {
      var book = await Book.find();
      res.status(201).json({books})
  } catch (error) {
      next(error)
  }
});

//create book

router.post('/', auth.verifyToken, async (req,res,next)=>{
  req.body.creater=req.user.userId
  req.body.categories = req.body.categories.trim().split(',');
  try {
    var book = await Book.create(req.body);
    res.status(201).json({book})
  } catch (error) {
    next(error)
  }
})

//Single book
router.get('/:id',async (req,res,next)=>{
  var id =  req.params.id;
  try {
    var book = await Book.findById(id);
    res.status(201).json({book})
  } catch (error) {
    next(error)
  }
});


//update
router.put ('/:id',auth.verifyToken,async (req,res,next)=>{
  var id =  req.params.id;
  req.body.categories = req.body.categories.trim().split(',');
  try {
    var book = await Book.findByIdAndUpdate(req.body);
    res.status(201).json({book})
  } catch (error) {
    next(error)
  }
})

//delete

router.delete('/:id',auth.verifyToken,async (req,res,next)=>{
  var id =  req.params.id;
  try {
    var book = await Book.findByIdAndDelete(id);
    res.status(201).json({book})
  } catch (error) {
    next(error)
  }
})



//add in cart
router.put ('/addToCart/:id',auth.verifyToken,async (req,res,next)=>{
  var productId =  req.params.id;
  try {
    var user = await User.findByIdAndUpdate(req.user.userId,{$push:{cart:productId}});
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
})

//Remove in cart
router.delete('/addToCart/:id',auth.verifyToken,async (req,res,next)=>{
  var productId =  req.params.id;
  try {
    var user = await User.findByIdAndUpdate(req.user.userId,{$pull:{cart:productId}});
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
})

module.exports = router;
