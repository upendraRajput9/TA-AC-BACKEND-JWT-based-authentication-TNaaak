const { json } = require('express');
var express = require('express');
var User = require('../model/User')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async (req,res,next)=>{
try {
  var user = await User.create(req.body);
  var token = await user.signToken();
  res.status(201).json({user:user.userJson(token)});
} catch (error) {
  next(error)
}
});

router.post('/login',async (req,res,next)=>{
  var {email,password} = req.body;
  if(!email||!password){
    res.status(400).json({error:"Email/password is required"})
  }
  try {
    var user = await User.findOne({email});
    if(!user){
      res.status(400).json({error:"Email is not register"})
    }
    var result = await user.verifyPassword(password);
  if(!result){
    return res.status(400).json({error:"Password is incorrect"})
  }
    var token = await user.signToken();
    res.status(201).json({user:user.userJson(token)});
  } catch (error) {
    next(err)
  }
  });

  
module.exports = router;
