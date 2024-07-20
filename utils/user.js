const bcrypt = require("bcrypt")
const async = require("async")
const {uploadFileToS3} = require("./aws_s3");
const mongodb = require("../mongodb");
const {ObjectId} = require("mongodb")
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

exports.signup = signup;
