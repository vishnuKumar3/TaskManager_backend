const express = require('express')
const tasksRouter = express.Router()
const utils = require("../utils")
const jwt = require("jsonwebtoken")

tasksRouter.use(function(req, res, next){
    let headers = req.headers;
    let userId = ""
    if(headers && headers.authorization){
        let tokenParts = headers.authorization.split(" ");
        if(Array.isArray(tokenParts) && tokenParts.length>=2){
            let accessToken = tokenParts[1];
            jwt.verify(accessToken,process.env.SECRET_KEY,function(err, result){
                if(err){
                    return res.json({
                        status:"error",
                        message:"Error occurred while processing the request",
                        error:err
                    })
                }
                else{
                    req.body["userId"] = result["userId"] || "";
                    next()
                }
            })
        }
    }
  })

tasksRouter.post("/add-task",function(req, res){
    utils.tasks.addTask(req, function(err, response){
        res.json(response);
        return;
    })
})

tasksRouter.post("/fetch-tasks",function(req, res){
    utils.tasks.fetchTasks(req,function(err, response){
        res.json(response);
        return;
    })
})

tasksRouter.post("/find-task-by-id",function(req, res){
    utils.tasks.findTaskById(req,function(err, response){
        res.json(response);
        return;
    })
})

tasksRouter.post("/update-task-by-id",function(req,res){
    utils.tasks.updateTaskById(req, function(err, response){
        res.json(response);
        return;
    })
})


module.exports = tasksRouter