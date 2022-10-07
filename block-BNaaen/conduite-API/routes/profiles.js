var express = require('express');
const User = require('../model/User');
var auth = require('../middelware/auth')

var router = express.Router();


//profile
router.get('/:username',auth.optionalVerify, async (req, res, next) => {
    var username = req.params.username;
    try {
        console.log(username)
        var loginUser =await User.findById(req.user.userId);
      var user = await User.findOne({ username });
      let following =user?loginUser.followingList.includes(user.username):false
      let {email,bio,image} =user
      res.status(201).json({ profile:{email,bio,image,following} })
    } catch (error) {
      next()
    }
  })
  


// following
router.get('/:username/follow',auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
  
    try {

      var user = await User.findById(req.user.userId)
      user = await user.followingList.includes(username)? await User.findByIdAndUpdate(req.user.userId, { $pull: { followingList: username } }):
     await User.findByIdAndUpdate(req.user.userId, { $push: { followingList: username } });
      res.status(201).json({ user })
    } catch (error) {
      next(error)
    }
  });
module.exports = router;
