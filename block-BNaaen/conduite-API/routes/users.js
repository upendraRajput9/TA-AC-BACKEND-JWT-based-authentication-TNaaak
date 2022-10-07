var express = require('express');
const User = require('../model/User');
var auth = require('../middelware/auth')

var router = express.Router();


//register
router.post('/', async (req, res, next) => {
  try {
    var user = await User.create(req.body.user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJson(token) })
  } catch (error) {
    next(error)
  }
});


//login
router.post('/login', async (req, res, next) => {
console.log("/login",req.body)
  var { email, password } = req.body.user;
  if (!email || !password) {
    return res.status(401).json({ error: "Email/Password is required" })
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "Email is not register" })
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(403).json({ error: "password is invalid" })
    }
    var token = await user.signToken();
    console.log(token)
    res.status(201).json({ user: user.userJson(token) })
  } catch (error) {
    next(error)
  }
})

//protected
router.use(auth.verifyToken)


//update user
router.put('/', async (req, res, next) => {

  try {
    var user = await User.findByIdAndUpdate(req.user.userId, req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.json(token) })
  } catch (error) {
    next(error)
  }
})


module.exports = router;
