const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskModel = new mongoose.Schema({
    _id:{
        type:Schema.Types.ObjectId,
        required:true
    },
    taskId:{
        type:String,
        required:true
    },
    state:{ //todo, in-progress,completed 
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    },
    createdAtUnixTime:{
        type:Number,
        required:true
    },
    createdAtStr:{
        type:String,
        required:true
    }
})

exports.tasks = mongoose.model("tasks",taskModel);