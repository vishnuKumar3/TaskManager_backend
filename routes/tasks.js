const express = require('express')
const tasksRouter = express.Router()
const utils = require("../utils")

tasksRouter.post("/add-task",function(req, res){
    utils.tasks.addTask(req, function(err, response){
        res.json(response);
        return;
    })
})

tasksRouter.get("/fetch-tasks",function(req, res){
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