const mongoose = require("mongoose");

async function connectDb(){
    await mongoose.connect("mongodb+srv://narayanavishnukumar:4VwaSSwgbHNF3Pgz@cluster0.8vy4qtn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then((data)=>{
        console.log("database connection successfully established");
    })
    .catch((err)=>{
        console.log(`Error occurred while connecting to db - ${err?.message}`)
    })
}

module.exports = connectDb;