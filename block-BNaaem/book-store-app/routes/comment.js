var express = require("express");
var Comment = require("../model/Comment");
var Book = require('../model/Book');
var auth = require('../middleware/auth')

var router = express.Router()

router.post('/:id',auth.verifyToken,(req,res,next)=>{
    var bookId = req.params.id;
    req.body.author = req.user.userId;
    req.body.book = bookId
    try {
        var comment = await Comment.create(req.body);
        var book = await Book.findByIdAndUpdate(bookId,{$push:{comment:comment._id}})
res.status(201).json({comment})
    } catch (error) {
        next(err)
    }
});

//comment update
router.put('/:id',auth.verifyToken,(req,res,next)=>{
    var commentId = req.params.id;
    try {
        var comment = await Comment.findByIdAndUpdate(commentId,req.body);
res.status(201).json({comment})
    } catch (error) {
        next(err)
    }
});

//
router.delete('/:id',auth.verifyToken,(req,res,next)=>{
    var commentId = req.params.id;
    try {
        var comment = await Comment.findByIdAndUpdate(commentId,);
        var book = await Book.findByIdAndUpdate(bookId,{$pull:{comment:commentId}})
res.status(201).json({comment})
    } catch (error) {
        next(err)
    }
});


module.exports = router