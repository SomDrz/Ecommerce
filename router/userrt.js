const { Login, Register, LogOut,forgotPassword,resetPassword,getUserdetail,updateUserRole,getSingleUser
,getAllUser,updateUser,deleteProfile} = require("../controller/userCon")
const {VerifyToken} = require("../middleware/verify")
const { Authorizationrole } = require("../middleware/verify.js")

const router = require("express").Router()

router.get("/logout",VerifyToken,LogOut)
router.post("/register",Register)
router.post("/login",Login)
router.post("/forgetpassword",forgotPassword) //forget password
router.route("/password/reset/:token").put(resetPassword); //reset password with email
router.get("/userdetail",VerifyToken,getUserdetail)
router.put("/updatepassword",VerifyToken,updateUser) //updatepassword


router.get("/admin/singleuser",VerifyToken,Authorizationrole("admin"),getSingleUser) //admin
router.get("/admin/getalluser",VerifyToken,Authorizationrole("admin"),getAllUser) //admin
router.put("/admin/updateUserRole/:id",VerifyToken,Authorizationrole("admin"),updateUserRole) //admin
router.delete("/admin/deleteprofile/:id",VerifyToken,Authorizationrole("admin"),deleteProfile) //admin

module.exports = router;
