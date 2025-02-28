import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../modles/user.model.js";
import {uplodeOnCloudinary} from "../utils/cloudinary.js";
import {Apiresponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req,res) => {
   // get user details from frontend
   // validation not empty
   // check if user already exist : username,email
   // check for images , check for avatar
   // upload to cloudinary,avatar
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation
   // return res
   const {fullName,email,username,password} = req.body
    if (
        [fullName, email, username, password].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields are required")
    }

    const exitedUser=User.findOne({
        $or:[{username}, {email}]
    })
    if (exitedUser) {
        throw new ApiError(409,"Username/email already exist");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar is required");
    }
    const avatar = await uplodeOnCloudinary(avatarLocalPath)
    const coverImage= await uplodeOnCloudinary(coverImageLocalPath )
    if (!avatar) {
        throw new ApiError(400,"avatar is required");
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username: username.toLowercase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    return res.status(201).json(
        new Apiresponse(200,createdUser,"user register successfully")
    )
})
export {registerUser}