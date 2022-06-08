var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken")
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,match:/@/,unique:true},
    password:{type:String,required:true},
    cart:[{type: Schema.Types.ObjectId , ref:"Book"}]
},{timestamps:true});

userSchema.pre("save", async function(next){
    if(this.password&&this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10); 
    }
    next()
})

//to verify password
userSchema.methods.verifyPassword = async function(password){
    try {
        var result = await bcrypt.compare(password,this.password)
        return result
    } catch (error) {
        return error
    }
};

// create token
userSchema.methods.signToken = async function(){
    var payload = {userId : this.id,email:this.email};
    try {
        var token = await jwt.sign(payload,process.env.SECRET);
        return token
    } catch (error) {
        return error
    }
};

userSchema.methods.userJson = function(token){
    return {
        name:this.name,
        email:this.email,
        token:token
    }
}

module.exports = mongoose.model("User",userSchema);

