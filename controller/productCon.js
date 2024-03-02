const Product = require("../model/product.js");
const ApiFeature = require("../utils/apifeature.js");
const User = require("../model/user.js")

const createProduct = async (req, res, next) => {
  try {

    console.log("yellow", req.body);
    req.body.user = req.user.id;
    const productdata = req.body;
    console.log(req.body);

   if (!productdata) return res.Status(402).json({ message: "product zero" });

    const data = await new Product(req.body).save();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    console.log(product);
    if (!product) return res.Status(402).json({ message: "product zero" });
    const data = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidator: true, useFindAndModify: false }
    );
    res.status(200).json(data);
  } catch (error) {
    console.log(error.stack);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ product, message: "delete" });
  } catch (error) {
    console.log(error.stack);
  }
};

const getallProduct = async (req, res) => {
  try {
    let resultperpage = 6
    const productCount = await Product.countDocuments();
    const apifeature = new ApiFeature(Product.find(), req.query)
      .Search()
      .Filter()
      .pagination(resultperpage);
    const products = await apifeature.query;
    console.log("2", products);

    res.status(200).json({ products, productCount ,resultperpage });
  } catch (error) {
    console.log(error.stack);
  }
};

// review the product
const reviewProduct = async(req,res) => {
  const {rating, comment, productId } = req.body;
  console.log(productId)
  const review = {
    user: req.user._id,
    rating: Number(rating),
    name: req.user.name,
    comment,
  };
  const product = await Product.findOne({_id: productId});
  console.log(product)
if(!product){
  res.status(404).json({message:"product not found"});
  
}
  const isReviewed = product.reviews.find( (rev) => rev.user.toString() === req.user._id.toString());
  if (isReviewed) { //edit the review by the loggin user
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } 
  
  else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length; // give you the no of review
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  product.ratings =  avg / product.reviews.length;
  console.log(product)
  await product.save();

  res.status(200).json({message:"true"});
};


// Get Product Details
const getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.json("no product")
  }

  res.status(200).json({
    success: true,
    product,
  });
};


//get single product review
const getReviewProduct =async(req,res)=>{
  const product = await Product.findById(req.query.id);
  if(!product)
    {
     res.status(404).json({message :"product not found"})
    }

  res.status(200).json({reviews: product.reviews})
}


//delete particular review
const deleteReviewProduct = async(req,res)=>{
  try {
    const product =  await Product.findById(req.query.productId)
    if(!product){
     res.status(404).json({message :"product not found"})
    }
    const reviews  =  product.reviews.filter((rev)=>{
      rev._id.toString() !== req.query.id.toString()
      // array consist of all review id !== we send id
    })
      
    let avg = 0;
    reviews.forEach((rev)=>{  //find the avg new reiviews after deletion of particular review
       avg = avg + rev.rating
    })
    console.log("h",avg)
    const ratings = avg / reviews.length;
    const numOfReviews =  reviews.length

  const data = await Product.findByIdAndUpdate(req.query.productId,{
    ratings,reviews,numOfReviews
  },{
   new: true, runValidator: true, useFindAndModify: false 
  })
  res.status(200).json(data)
  } catch (error) {
    console.log(error.stack);
    
  }
    
}



module.exports = {
  getallProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  reviewProduct,
  getProductDetails,
  getReviewProduct,
  deleteReviewProduct
};
