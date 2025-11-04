import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadBuffer = (fileBuffer)=>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({resource_type: "image", folder: "game-library-seb87"},
            (error, uploadResult)=>{
            //If the image falils to upload to cloudinary for whatever reason we will have the details on errir
            // we reject the promise hwich willl throw the user into the catch block giving them access to the error details
            if(error) reject(error);
            resolve(uploadResult)
        }).end(fileBuffer)
    })
}
export {cloudinary, uploadBuffer};