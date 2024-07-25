const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT;
const connectDb = require("../database_config");
const userRouter = require("../routes/user")
const cors = require("cors");
const multer = require("multer");
const tasksRouter = require("../routes/tasks");
const storage = multer.memoryStorage()
const mongoose = require("mongoose");



const app=express()
app.use(cors({origin:["http://localhost:3000","https://master--task-management-react123.netlify.app"]}))
app.use(express.json())
app.use(multer({storage:storage}).any())
app.use("/user",userRouter);
app.use("/tasks",tasksRouter)

app.get("/",async function(req,res){
    await mongoose.connect(`${process.env.MONGODB_URI}`)
    .then((data)=>{
        console.log("database connection successfully established");
    })
    .catch((err)=>{
        console.log(`Error occurred while connecting to db - ${err?.message}`)
    })      
    res.json({
        status:"success"
    })
})

app.listen(PORT, async function(){
    //connectDb()  
    console.log(`app running on ${PORT}`)
})