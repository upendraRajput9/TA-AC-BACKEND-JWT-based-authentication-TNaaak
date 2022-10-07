var express = require('express');
const User = require('../model/User');
var auth = require('../middelware/auth')

var router = express.Router();


router.use(auth.verifyToken)
router.get('/', async function (req, res, next) {
    try {
      var user = await User.findById(req.user.userId);
      console.log(user)
      let {email,bio,image} =user
      res.status(201).json({user: {email,bio,image}})
    } catch (error) {
      next(error)
    }
  });
module.exports = router;
