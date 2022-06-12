var express = require('express');
const User = require('../model/User');
var auth = require('../middelware/auth')

var router = express.Router();

/* GET users listing. */
router.get('/',async function(req, res, next) {
  try {
    var users = await User.find({});
    res.status(201).json({users})
  } catch (error) {
    next(error)
  }
});

//register
router.post('/',async (req,res,next)=>{
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({user:user.userJson(token)})
  } catch (error) {
    next(error)
  }
});

//login
router.post('/login',async (req,res,next)=>{
  
 var {email,password} = req.body;
 console.log(email,password)
 if(!email||!password){
   return res.status(401).json({error:"Email/Password is required"})
 }
  try {
    var user = await User.findOne({email});
    if(!user){
      return res.status(403).json({error:"Email is not register"})
    }
    var result = await user.verifyPassword(password);
    if(!result){
      return res.status(403).json({error:"password is invalid"})
    }
    var token = await user.signToken();
    res.status(201).json({user:user.userJson(token)})
  } catch (error) {
    next(error)
  }
})

//protected
router.use(auth.verifyToken)

//update user
router.put('/',async (req,res,next)=>{
  
  try {
    var user = await User.findByIdAndUpdate(req.user.userId,req.body);
    var token = await user.signToken();
    res.status(201).json({user:user.json(token)})
  } catch (error) {
    next(error)
  }
})

// following
router.get('/:id/follow',async (req,res,next)=>{
  var id = req.params.id;
  try {
    var user = await User.findByIdAndUpdate(req.user.userId,{$push:{followingList:id}});
    var followuser =await User.findByIdAndUpdate(id,{$push:{followerList:user._id}});
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
});

//unfollow
router.get('/:id/unfollow',async (req,res,next)=>{
  var id = req.params.id;
  try {
    var user = await User.findByIdAndUpdate(req.user.user,{$pull:{followingList:id}});
    var followuser =await User.findByIdAndUpdate(id,{$pull:{followerList:user._id}});
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
});
module.exports = router;
