const router = require("express").Router();
const {  newOrder,getsingleOrder,myOrder,getallOrder,updateOrder,deleteOrder} = require("../controller/order.js")
const { Authorizationrole,VerifyToken } = require("../middleware/verify.js")

router.post("/order/new",VerifyToken,newOrder);
router.get("/order/:id",VerifyToken,getsingleOrder);

router.get("/loggeduser/order",VerifyToken,myOrder) ;//user 
router.get("/getalls/order",VerifyToken,Authorizationrole("admin"),getallOrder); //admin

router.put("/admin/updateOrder/:id",VerifyToken,Authorizationrole("admin"),updateOrder) //admin
router.delete("/admin/deleteOrder/:id",VerifyToken,Authorizationrole("admin"),deleteOrder) //admin

module.exports = router