var express = require('express');
var User = require('../model/User')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async (req,res,next)=>{
  try{
var user = await User.create(req.body);
console.log(user)
  res.status(201).json({user})
  
  }catch(error){
    next(error)
  }
  });


router.post('/login',async (req,res,next)=>{
  var {email,password} = req.body;
  if(!email||!password){
    res.status(400).json({error:"Email/Password required"})
  }
  try{
  var user = await User.findOne({email});
  if(!user){
   return res.status(400).json({error:"Email is not registered"})
  }
  var result = await user.verifyPassword(password);
  if(!result){
    return res.status(400).json({error:"Password is incorrect"})
  }
  var token = await user.signToken();
  console.log(token)
  res.json({user:{...user,token}})
  }catch(error){
    next(error)
  }
  })
module.exports = router;
