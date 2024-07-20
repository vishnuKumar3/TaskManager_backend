const {tasks} = require("../models/taskModel");

const findOne = async(criteria, callback)=>{
    try{
        let res = await tasks.findOne(criteria)
        console.log("tasks - findOne operation - success",res)
        callback(null, res)
    }
    catch(err){
        console.log("tasks - findOne operation - error",err)
        callback(true,{})
    }
}

const find = async(criteria, callback)=>{
    try{
        let res = await tasks.find(criteria)
        console.log("tasks - find operation - success",res)
        callback(null, res)
    }
    catch(err){
        console.log("tasks - find operation - error",err)
        callback(true,{})
    }
}

const insertOne = async(taskData, callback)=>{
    try{
        let res = await tasks(taskData).save()
        console.log("tasks - insertOne operation - success",res)
        callback(null, res)
    }
    catch(err){
        console.log("tasks - insertOne operation - error",err)
        callback(true,{})
    }
}

const updateOne = async(criteria, updateInfo, callback)=>{
    try{
        let res = await tasks.updateOne(criteria,updateInfo)
        console.log("tasks - updateOne operation - success",res)
        callback(null, res)
    }
    catch(err){
        console.log("tasks - updateOne operation - error",err)
        callback(true,{})
    }
}

exports.findOne = findOne;
exports.find = find;
exports.insertOne = insertOne;
exports.updateOne = updateOne;