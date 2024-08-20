import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userID)=>{
  try {
    const user = await User.findById(userID)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken=refreshToken
    await user.save({validatBeforeSave : false})

    return {refreshToken,accessToken}

  } catch (error) {
    throw new ApiError(501,"something went wrong ")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
      $or: [{ username }, { email }]
  });

  if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
  }

  console.log("email : ",email)
  console.log("username : ",username)
  console.log("password : ",password)
  console.log("fullName : ",fullName)

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path;
  }
  console.log("avataralocal path :",avatarLocalPath)
  console.log("coverImage local path : ",coverImageLocalPath)

  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
  }); 

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
  );
});

const loginUser = asyncHandler(async (req,res) => {
    //req. body -> data\
    // username or email
    // find the user
    //check the password
    //access and refresh token
    // send cookies
  const [email,username,password] = req.body

  if(!email || !username){
    throw new ApiError(400,"email or username is necessary")

  }
  const user = await User.findOne(
    {
      $or: [{email} , {username}]
    }
  )

  if(!user){
    throw new ApiError(404,"user not exist")
  }
  const ispasswordvalid = await user.isPasswordCorrect(password)

  if(isPasswordCorrect)
  {
    throw new ApiError(409,"invalid credentials")
  }

  const {accessToken,refreshToken} = generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser , accessToken,refreshToken
      },
      "User is successfully logged In"
    )
  )

});

const logoutUser = asyncHandler(async()=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken: 1 // this removes the field from document
        }
    },
    {
        new: true
    }
)

const options = {
    httpOnly: true,
    secure: true
}
return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged Out"))

})


export {
  registerUser,
  loginUser,
  logoutUser
}
