const express = require("express");
const router = express.Router();
const StatusCodes = require("http-status-codes")
const utils = require("../utils")

router.post("/signup",async function(req, res){ 
  utils.user.signup(req, function(err, result){
    res.status(StatusCodes.OK).json(result)
  })
})

router.post("/login",async function(req, res){
  utils.user.login(req, function(err, response){
    res.json(response)
  })
})

module.exports = router;
