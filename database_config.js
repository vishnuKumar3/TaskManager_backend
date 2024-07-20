const mongoose = require("mongoose");

async function connectDb(){
    await mongoose.connect(`${process.env.MONGODB_URI}`)
    .then((data)=>{
        console.log("database connection successfully established");
    })
    .catch((err)=>{
        console.log(`Error occurred while connecting to db - ${err?.message}`)
    })
}

module.exports = connectDb;