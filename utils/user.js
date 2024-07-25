const bcrypt = require("bcrypt")
const async = require("async")
const {uploadFileToS3} = require("./aws_s3");
const mongodb = require("../mongodb");
const {ObjectId} = require("mongodb")
const jwt = require("jsonwebtoken")
const moment = require("moment")


const signup = (req, callback)=>{
    let reqBody = req.body;
    let files = req.files
    let userId = new ObjectId();
    let userInfo = {
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        signInType:"",
        avatarInfo:{},
        _id:userId,
        userId:userId.toHexString()
    }    
    if(reqBody.firstName && reqBody.email && reqBody.signInType){
        async.waterfall([
            function(triggerCallback){
                if(reqBody.signInType.toLowerCase() === "google"){
                    Object.assign(userInfo,reqBody);
                    triggerCallback(null, userInfo)
                }
                else{
                    if(reqBody.password!=""){
                        reqBody.password = bcrypt.hashSync(reqBody.password,10);
                        Object.assign(userInfo,reqBody);
                        triggerCallback(null, userInfo)
                    }
                    else{
                        triggerCallback(true,{
                            status:"error",
                            message:"Please provide valid details"
                        })
                    }
                }
            },
            function(userInfo,triggerCallback){
                mongodb.user.findOne({email:userInfo.email},function(err, response){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while fetching user data",
                            error:err
                        })
                    }
                    else{
                        if(response){
                            triggerCallback(true,{
                                status:"error",
                                message:"User exists with the given email. Please Login"
                            })
                        }
                        else{
                            triggerCallback(null,userInfo)
                        }
                    }
                })
            },
            function(userInfo, triggerCallback){
                if(files && files.length>0){
                    let fileInfo = files[0];
                    let d = new Date();
                    let fileName = userInfo.firstName+"_"+d.getTime();
                    uploadFileToS3(fileName, fileInfo.buffer,function(err, result){
                        if(err){
                            triggerCallback(null, userInfo)
                        }
                        else{
                            userInfo.avatarInfo = result && result.data?result.data:{};
                            triggerCallback(null, userInfo)
                        }
                    })
                }
                else{
                    triggerCallback(null,userInfo)
                }
            },
            function(userInfo, triggerCallback){
                mongodb.user.insertOne(userInfo,function(err, result){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while signup. Please try again",
                            error:err
                        })
                    }
                    else{
                        triggerCallback(null,{
                            status:"success",
                            message:"You are successfully registered. Now you can explore the app"
                        })
                    }
                })
            }
          ],
          function(err, result){
            callback(err, result)
        })
    }
    else{
        callback(true,{
            status:"error",
            message:"Please provide valid details"
        })
        return;
    }
}

const login = (req, callback)=>{
    let reqBody = req.body;
    let criteria = {};
    if(reqBody.email && reqBody.signInType){
        console.log("reqBody",req.body);
        async.waterfall([
            function(triggerCallback){
                console.log("first function");
                criteria["email"] = reqBody.email;
                let userInfo = {
                    firstName:"",
                    lastName:"",
                    email:"",
                    password:"",
                    signInType:"",
                    avatarInfo:{},
                    _id:userId,
                    userId:userId.toHexString()
                }
                triggerCallback(null,userInfo)
                /*mongodb.user.findOne(criteria,function(err, response){
                    if(err){
                        triggerCallback(true,{
                            status:"error",
                            message:"Error occurred while fetching user data",
                            error:err
                        })
                    }
                    else{
                        if(response && response.email === reqBody.email){
                            triggerCallback(null, response)
                        }
                        else{
                            triggerCallback(true,{
                                status:"error",
                                message:"User record not found for the given email. Please register"
                            })
                        }
                    }
                })*/
            },
            function(userData, triggerCallback){
                console.log("second function");
                if(reqBody.signInType.toLowerCase() === "google"){
                    triggerCallback(null, userData)
                }
                else{
                    if(reqBody.password && reqBody.password!=""){
                        let passwordValidity = bcrypt.compareSync(reqBody.password,userData.password);
                        if(passwordValidity){
                            triggerCallback(null, userData);
                        }
                        else{
                            triggerCallback(true,{
                                status:"error",
                                message:"The password you entered is not correct. Please try again"
                            })                            
                        }
                    }
                    else{
                        triggerCallback(true,{
                            status:"error",
                            message:"Please provide valid details"
                        })
                    }
                }
            },
            function(userData, triggerCallback){
                console.log("thrid function");
                let minimalUserInfo = JSON.stringify({
                    userId:userData.userId || "",
                    createdAtUnixTime:moment().valueOf()
                })
                const token = jwt.sign(minimalUserInfo,process.env.SECRET_KEY)
                triggerCallback(null,{
                    status:"success",
                    message:"Verification completed.Please explore the app",
                    token:token,
                    userData:{
                        userId:userData.userId || "",
                        avatarInfo:userData.avatarInfo || "",
                        firstName:userData.firstName || "",
                        lastName:userData.lastName || ""
                    }
                })
            }
        ],
        function(err, result){
            console.log("final callback function in async")
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

exports.signup = signup;
exports.login = login;
