const mongodb = require('../mongodb')
const {ObjectId} = require("mongodb")
const config = require("../config")
const moment = require("moment")
const async = require("async")

const addTask = (req, callback)=>{
    let reqBody = req.body;

    let taskObj = {
        _id:"",
        taskId:"",
        state:config.taskStates.TODO,
        createdAt:"",
        userId:"",
        createdAtUnixTime:"",
        createdAtStr:"",
        title:"",
        description:""
    }

    if(reqBody && reqBody.title && reqBody.description && reqBody.userId){
        async.waterfall([
            function(triggerCallback){
                let uniqueId = new ObjectId();
                let momentObj = moment();
                Object.assign(taskObj,reqBody);
                taskObj._id = uniqueId;
                taskObj.createdAt = momentObj.toDate();
                taskObj.createdAtStr = momentObj.format();
                taskObj.createdAtUnixTime = momentObj.valueOf();
                taskObj.taskId = uniqueId.toHexString();
                mongodb.tasks.insertOne(taskObj,function(err, response){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while adding task. Please try again",
                            error:err
                        })
                    }
                    else{
                        triggerCallback(null,{
                            status:"success",
                            message:"Task successfully added"
                        })
                    }
                })                
            }
        ],
        function(err, result){
            callback(err, result)
        }
        )
    }
    else{
        callback(true,{
            status:"error",
            message:"Please provide valid details"
        })
    }
}

const fetchTasks = (req, callback)=>{
    let reqBody = req.body;
    if(reqBody && reqBody.userId){
        async.waterfall([
            function(triggerCallback){
                let keyword = reqBody && reqBody.keyword?reqBody.keyword:"";
                let projection = reqBody && reqBody.projection?reqBody.projection:{}
                mongodb.tasks.find({userId:reqBody.userId,title:{$regex:`.*${keyword}.*`,$options:"i"},state:{$nin:[config.taskStates.DELETED]}},projection,function(err, response){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while fetching tasks",
                            error:err
                        })
                    }
                    else{
                        triggerCallback(null,response)
                    }
                })
            },
            function(tasks, triggerCallback){
                let taskStates = config.taskStates;
                let categorizedTasks = {};            
                Object.values(taskStates).map((state)=>{
                    categorizedTasks[state]=[]
                })
                tasks.map((task)=>{
                    if(task.state){
                        if(categorizedTasks.hasOwnProperty(task.state)){
                            categorizedTasks[task.state].push(task);
                        }
                    }
                })
                triggerCallback(null, {
                    status:"success",
                    message:"Successfully fetched all the tasks",
                    tasks:categorizedTasks
                })
            }
        ],
        function(err, result){
            callback(err, result)
        }
        )
    }
    else{
        callback(true,{
            status:"error",
            message:"Please provide valid details"
        })
    }
}

const findTaskById = (req, callback)=>{
    let reqBody = req.body;
    if(reqBody && reqBody.taskId && reqBody.userId){
        async.waterfall([
            function(triggerCallback){
                mongodb.tasks.findOne({taskId:reqBody.taskId, userId:reqBody.userId},function(err, response){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while fetching task",
                            error:err
                        })
                    }
                    else{
                        triggerCallback(null,{
                            status:"success",
                            message:"Successfully fetched task info",
                            taskInfo:response
                        })
                    }
                })
            }
        ],
        function(err, result){
            callback(err, result)
        }
        )
    }
    else{
        callback(true,{
            status:"error",
            message:"Please provide valid details"
        })
    }
}

const updateTaskById = (req, callback)=>{
    let reqBody = req.body;
    if(reqBody && reqBody.taskId &&  reqBody.userId && reqBody.updateInfo){
        async.waterfall([
            function(triggerCallback){
                mongodb.tasks.updateOne({taskId:reqBody.taskId, userId:reqBody.userId},{$set:reqBody.updateInfo},function(err, response){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while updating tasks",
                            error:err
                        })
                    }
                    else{
                        triggerCallback(null,{
                            status:"success",
                            message:"Successfully updated the task",
                        })
                    }
                })
            }
        ],
        function(err, result){
            callback(err, result)
        }
        )
    }
    else{
        callback(true,{
            status:"error",
            message:"Please provide valid details"
        })
    }    
}




exports.addTask = addTask;
exports.fetchTasks = fetchTasks;
exports.findTaskById = findTaskById;
exports.updateTaskById = updateTaskById;
