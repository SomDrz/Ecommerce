const mongoose = require("mongoose")

const Connection=async()=>{
          await  mongoose.connect(process.env.MONGO_URL )
    .then(()=>{
        
        console.log("mongo-DB")
    })
    .catch((err)=>{
        console.log(err)
    })
}  
module.exports= {Connection}
