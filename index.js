const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT;
const connectDb = require("./database_config");

const app=express()
app.use(express.json())

app.listen(PORT, function(){
    connectDb()
    console.log(`app running on ${PORT}`)
})