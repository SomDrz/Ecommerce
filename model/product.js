const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "enter the name"]

    },
    description: {
        type: String,
        required: [true, "enter the description"]
    },
    price: {
        type: Number,
        required: [true, "enter the price"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true

            },


            url: {
                type: String,
                required: true

            }
        }
    ],
  
    Stock:{
        type: String,
        required: true,
        maxLength:[10,"10 is limit"],
        default:1
    },
    catagories:{
      type: String,
      required: true
  },
    numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            // required: true,
          },
          rating: {
            type: Number,
            // required: true,
          },
          comment: {
            type: String,
            // required: true,
          },
        },
      ],
    
      user: {
        type: mongoose.Schema.ObjectId, //createproduct user
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now
      },

})

module.exports = mongoose.model("product", ProductSchema)