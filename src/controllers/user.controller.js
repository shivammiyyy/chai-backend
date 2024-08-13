import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    //get user details from frontend
    //validation -- not empty or manditory column
    // check if user already exist in the database or not
    //check for images, check for avatar
    //upload it in cloudinary
    //create user object -- create entry in database
    //remove passwords and refreshtoken fields from response
    // check for user creation
    //return res

    const {fullname, password, email,username} = req.body
    console.log("email : ",email)

    // if(fullname ===""){
    //     throw new ApiError(400,"fullanem is required")
    // }

    if([fullname, password, email,username].some((filed)=>filed?.trim()==="")){
        throw new ApiError(400, "all fileds required")
    }
    const existedUser =  User.findOne({
        $or: [{ username}, { email}]
    })

    if(existedUser){
        throw new ApiError(409,"USER ALREADY EXIST")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"AVATAR IS NECESSARY")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"AVATAR IS NECESSARY")
    }


    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username : username.toLowerCase(),
        password,
        email
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

} )


export {
    registerUser,
}