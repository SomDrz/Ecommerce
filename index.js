const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")

const {Connection} =  require("./db/db.js")
dotenv.config()
const product = require("./router/productrt.js")
const auth  =  require("./router/userrt.js")
const order = require("./router/order")
app.use(express.json({extended:true}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/",product)
app.use("/api/",auth)
app.use("/api/",order)
Connection()
app.listen(process.env.PORT || 8000, () => {
    console.log(`Backend running  `);
  });
  