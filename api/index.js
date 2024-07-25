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
app.use(cors({origin:["https://master--task-management-react123.netlify.app"]}))
app.use(express.json())
app.use(multer({storage:storage}).any())
app.use(function(req, res,next){
    connectDb();
    console.log("Initialization of db connection");
    setTimeout(()=>{
        next();
    },1000)
})
app.use("/user",userRouter);
app.use("/tasks",tasksRouter)

app.get("/",async function(req,res){
    connectDb();     
    res.json({
        status:"success"
    })
})

app.listen(PORT, async function(){
    connectDb()  
    console.log(`app running on ${PORT}`)
})