var express = require('express');
var auth = require("../middleware/auth")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.loginUser)
  res.render('index', { title: 'Express' });
});

router.get("/dashboard",auth.verifyToken,(req,res)=>{
  
  res.json({access:"user is valid"})
})


module.exports = router;
