const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT;
const connectDb = require("./database_config");
const userRouter = require("./routes/user")
const cors = require("cors");
const multer = require("multer")
const storage = multer.memoryStorage()


const app=express()
app.use(cors({origin:["http://localhost:3000"]}))
app.use(express.json())
app.use(multer({storage:storage}).any())
app.use("/user",userRouter);

app.listen(PORT, function(){
    connectDb()
    console.log(`app running on ${PORT}`)
})