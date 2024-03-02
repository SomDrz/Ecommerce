const router = require("express").Router()

const {createProduct,updateProduct,deleteProduct,getallProduct,getProductDetails,reviewProduct,deleteReviewProduct} = require("../controller/productCon")
const { Authorizationrole,VerifyToken } = require("../middleware/verify.js")


router.post("/admin/product",VerifyToken,Authorizationrole("admin"),createProduct)
router.put("/admin/product/:id",VerifyToken,Authorizationrole("admin"),updateProduct)

router.delete("/admin/product/:id",VerifyToken,Authorizationrole("admin"),deleteProduct)
router.get("/product",getallProduct)

router.get("/product/:id",getProductDetails)
 //review
router.put("/review",VerifyToken,reviewProduct)

router.delete("/delete/review",VerifyToken,deleteReviewProduct) //delete review

module.exports = router;