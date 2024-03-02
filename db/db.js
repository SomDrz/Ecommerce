const mongoose = require("mongoose")

const Connection=async()=>{
          await  mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://bigbox:box@box.qktu8.mongodb.net/Box?retryWrites=true&w=majority')
    .then(()=>{
        
        console.log("mongo-DB")
    })
    .catch((err)=>{
        console.log(err)
    })
}  
module.exports= {Connection}