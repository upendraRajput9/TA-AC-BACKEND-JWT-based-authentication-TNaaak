var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;
var jwt = require("jsonwebtoken");
var userSchema = new Schema({
    name:String,
    email:String,
    password:String
},{timestamps:true});

userSchema.pre("save", async function(next){
    if(this.password&&this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
        
    }
    
    next()
})

userSchema.methods.verifyPassword = async function(password){
    try{
    var result = await bcrypt.compare(password,this.password);
   return result
}catch(error){
    return error
}
};

userSchema.methods.signToken = async function(){
    var payload = {userId:this.id,email:this.email};
    try{
     var token =   await jwt.sign(payload,"thisisascrete")
        return token
    }catch(err){
        return error
    }
   
}

module.exports = mongoose.model("User",userSchema)