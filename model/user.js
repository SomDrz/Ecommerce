
const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const bcrypt = require("bcryptjs");
require("dotenv").config();
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,

        required: [true, "enter username "]
    },
    password: {
        type: String,
        unique: true,
        required: [true, "enter pasword "],
        // select: false
    },
    email: {
        type: String,
        unique: true,
        required: [validator.email, "enter email"]
    },
    avatar: {
        public_id: {
        type: String,
        required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
}, { timestamps: true })

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")){

       return next()
    }
    const salt = await bcrypt.genSalt(10);
    
    this.password = await bcrypt.hash(this.password, salt)
  
})

userSchema.methods.getjwtToken = function () {
    return jwt.sign({ id: this._id },"dwfegrtrfedwfrgt", { expiresIn: "4d" })
}

userSchema.methods.ComparePassword = async function (enterpassword) {
    // console.log(this.name)
    // console.log(await bcrypt.compare(enterpassword, this.password))
    return await bcrypt.compare(enterpassword, this.password)
}
userSchema.methods.resetPassword  = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken ;
    
}
module.exports = mongoose.model("User", userSchema)