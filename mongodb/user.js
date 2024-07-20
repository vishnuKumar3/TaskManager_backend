const {users} = require("../models/userModel")

const insertOne = async (data, callback)=>{
  try{
    let res = await users.insertMany([data])
    console.log("user - insert operation",res);
    callback(null, res)
  }
  catch(err){
    console.log("user - error occurred while signup",err)
    callback(err,{})
  }
}

const findOne = async(criteria, callback)=>{
  try {
    let res = await users.findOne(criteria)
    console.log("user - findOne operation",res)
    callback(null, res)
  }
  catch(err){
    console.log("user - findOne operation - error",err)
    callback(err,{})
  }
}

exports.insertOne = insertOne;
exports.findOne = findOne;
