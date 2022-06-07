var express = require('express');
var User = require("../model/User")
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register
router.post('/register',async (req,res,next)=>{
  
  try{
    
  var user = await User.create(req.body);
  
  var token = await user.signToken();
  res.status(201).json({user : user.userJSON(token)})
  }catch(error){
    if(error){
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ error: 'This Email is already registered...' });
      }
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .json({ error: 'Enter a valid and strong Password...' });
      }
    }
  }
  });
  
  //login
  router.post("/login",async (req,res,next)=>{
    var {email,password} = req.body
    if(!email||!password){
      return res.status(400).json({error:"Email/passwordrequired"})
    }
    try{
      var user = await User.findOne({email});
      
      if(!user){
        res.status(400).json({error:"Email is not registered"})
      }
      var result = await user.verifyPassword(password);
      console.log(result,user)
      if(!result){
        res.status(400).json({error:"invalid password"})
      }
      //generte token
    var token = await user.signToken();
      res.status(201).json({user:user.userJSON(token)})
      }catch(error){
        next(error)
      }
  })
  
 
module.exports = router;
