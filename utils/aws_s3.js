const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1",
  });

const s3 = new AWS.S3();

const uploadFileToS3 = (fileName, fileBuffer, callback)=>{
    const uploadParams = {
        ACL:"public-read",
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: fileBuffer
      };

      s3.upload(uploadParams, (err, data) => {
        if (err) {
            console.log('Error uploading file:', err);
            callback(true,{
                status:"error",
                message:"Error occurred while uploading file to s3",
                error:err
            })
        } else {
            callback(null,{
                status:"success",
                message:"Successfully uploaded file to s3",
                data:data
            })
        }
      });        
}

exports.uploadFileToS3 = uploadFileToS3;