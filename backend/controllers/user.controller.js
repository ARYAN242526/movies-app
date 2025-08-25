import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createToken } from "../utils/createToken.js";


const createUser = asyncHandler(async(req,res) => {
    const {username , email , password , isAdmin} = req.body;

    if(!username || !email || !password){
        throw new ApiError(400 , "All fields are required")
    }

    // check if user already exists or not
    const userExists = await User.findOne({email});

    if(userExists){
        throw new ApiError(400 , "User already exists")
    }
    // hash the user password
     const hashedPassword = await bcrypt.hash(password , 10);

       const user =  await User.create({
            username , 
            email,
            password : hashedPassword,
            isAdmin
       })
       


       if(!user){
        throw new ApiError(400 , "Error while creating user")
       }

       return res
                 .status(201)
                 .json(new ApiResponse(201 , {
                    _id : user._id,
                    username : user.username,
                    email : user.email,
                    isAdmin : user.isAdmin,
                 } , "user created successfully"));
   
})

const loginUser = asyncHandler(async(req,res) => {
    const {email , password } = req.body;

    if(!email || !password){
        throw new ApiError(400 , "Email and password both are required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400 , "User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);

    if(!isPasswordValid){
       throw new ApiError(400 , "Invalid credentials")
    }

    const token = createToken(res , user._id);

    const loggedInUser = await User.findById(user._id).select("-password");



    return res
             .status(201)
             .json(new ApiResponse(201 ,{
                _id : loggedInUser._id,
                username : loggedInUser.username,
                email : loggedInUser.email,
                isAdmin : loggedInUser.isAdmin,
                token : token,
             }, "User logged in successfully"))

})

const logoutUser = asyncHandler(async(req,res) => {
     await User.findByIdAndUpdate(
        req.user._id ,
    {
        $unset : {
            token : ""
        }
    },
    {
        new : true
    }
)
  return res
            .status(200)
            .clearCookie("token" , {
                httpOnly : true
            })
            .json(new ApiResponse(200, {}, "User logged out"))
})

const getAllUsers = asyncHandler(async(req,res) => {
    const users = await User.find({}).select("-password");
    if(!users){
        throw new ApiError(400 , "Users not found")
    }

    return res
              .status(200)
              .json(new ApiResponse(200 , users , "Fetched all users"));
})

const getCurrentUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id).select("-password");
    // console.log(user);
    if(!user){
        throw new ApiError(400 , "User not found")
    }

    return res
             .status(200)
             .json(new ApiResponse(200 , {
                _id : user._id,
                username : user.username,
                email : user.email,
                isAdmin : user.isAdmin,
             } , "Current User Profile fetched"))

})

const updateCurrentUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(400 , "User not found")
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin

    if(req.body.password){
        const hashedPassword = await bcrypt.hash(req.body.password , 10);
        user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    return res.status(200).json(new ApiResponse(200 , {
        _id : updatedUser._id,
        username : updatedUser.username,
        email : updatedUser.email,
        isAdmin : updatedUser.isAdmin
    },"User Profile updated"))

})

export {createUser , loginUser , logoutUser, getAllUsers , getCurrentUserProfile , updateCurrentUserProfile}