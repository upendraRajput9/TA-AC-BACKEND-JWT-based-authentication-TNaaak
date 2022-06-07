var jwt = require("jsonwebtoken");
module.exports = {
    verifyToken :async function(req,res,next){    
       try {
        var token = req.headers.authorization;
       
        if(token){
            
         var payload = await jwt.verify(token,process.env.SECRET);
         console.log(payload)
         req.user = payload;
         
         return next()
        }else{
            res.status(400).json({error:"Token Required"})
        }
       } catch (error) {
           next(error)
       }
       
    }
}