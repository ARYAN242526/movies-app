import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createToken } from "../utils/createToken.js";



const createUser = asyncHandler(async(req,res) => {
    const {username , email , password} = req.body;

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
            password : hashedPassword
       })
       
       const createdUser = await User.findById(user._id).select("-password")

       if(!createdUser){
        throw new ApiError(400 , "Error while creating user")
       }

       return res
                 .status(201)
                 .json(new ApiResponse(201 , createdUser , "user created successfully"));
   
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

    const isPasswordValid = bcrypt.compare(password , user.password);

    if(!isPasswordValid){
       throw new ApiError(400 , "invalid credentials")
    }

    const {token} = createToken(res , user._id);

    const loggedInUser = await User.findById(user._id).select("-password");



    return res
             .status(201)
             .cookie("token" , token)
             .json(new ApiResponse(201 , {
                user : {loggedInUser , token}
             } , "User logged in successfully"))

})


export {createUser , loginUser}