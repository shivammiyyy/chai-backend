import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process4.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process4.env.CLOUDINARY_API_KEY,
    api_secret: process4.env.CLOUDINARY_API_SECRET 
});

const UploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type : "auto"
            }
        )
        //resourse has been uploaded
        console.log("file is uploaded on cloudinary",response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved file path temporarily saved as operation is faled
        return null;
    }
}

export {UploadOnCloudinary}