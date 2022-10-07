var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    image: { type: String },
    username: { type: String, required: true },
    bio: { type: String },
    email: { type: String, required: true, match: /@/, unique: true },
    password: { type: String, required: true, minlength: 4 },
    favorited: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followingList: [{ type: String }],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.password && this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//verify password
userSchema.methods.verifyPassword = async function (password) {
    try {
        var result = await bcrypt.compare(password, this.password)
        return result
    } catch (error) {
        return error
    }
}

//create token
userSchema.methods.signToken = async function () {
    var payload = { userId: this.id, email: this.email }
    try {
        var token = await jwt.sign(payload, process.env.SECRET);
        return token
    } catch (error) {
        return error
    }
};

userSchema.methods.userJson = function (token) {

    return {
        name: this.name,
        email: this.email,
        token: token
    }
}

userSchema.methods.profileJson = function (token) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
    }
}
module.exports = mongoose.model("User", userSchema)