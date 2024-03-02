const User = require("../model/user");
const jwt = require("jsonwebtoken");

const VerifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "can not access the resource" })
        }
        const decoded = jwt.verify(token, "dwfegrtrfedwfrgt")
        console.log(decoded)
        req.user = await User.findById({ _id: decoded.id })
        console.log("h",req.user)
        next()
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }

}
const Authorizationrole = (...roles) => {

    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
         next(
             res.status(401).json(`${req.body.role} only can access`)
         )
        }
        next()
    }
};
module.exports = { VerifyToken, Authorizationrole }