var jwt = require("jsonwebtoken");

module.exports = {
    verifyToken : async function(req,res,next){
        try {
           let {headers} =req.headers
            var token = headers
            if(token){
                var payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                console.log(payload,token)
                return next()
            }
        } catch (error) {
            next(error)
        }
    },
    optionalVerify: async function(req,res,next){
        try {
            let {headers} =req.headers
            var token = headers
            if(token){
                var payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                return next()
            }else{
                next()
            }
        } catch (error) {
            next(error)
        }
    }

}