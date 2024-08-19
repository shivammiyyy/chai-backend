import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


    cloudinary.config({ 
        cloud_name: 'dlnq0irzl', 
        api_key: 514798643232964, 
        api_secret: 'cxXRgXhMG06JcF4bygN8EWDxVw8' // Click 'View Credentials' below to copy your API secret
    });



    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null
            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            // file has been uploaded successfull
            console.log("file is uploaded on cloudinary ", response.url);
            return response;
            fs.unlinkSync(localFilePath)
    
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
            return null;
        }
    }
    
    
    
    export {uploadOnCloudinary}