import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';


// check if the user is authenticated or not
const authenticate = asyncHandler(async(req, res , next) => {

    const token = req.cookies.token;

    if(token){
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select("-password");
            next()
        } catch (error) {
           throw new ApiError(401 , "Token failed") 
        }
    } else{
        throw new ApiError(400 , "Not authorized, no token");
    }
})

// check if the user is admin or not

const authorizeAdmin = async(req,res ,next) => {
    if(req.user && req.user.isAdmin){
        next();
    } else {
        throw new ApiError(401, "Not authorized as an admin");
    }
}

export {authenticate , authorizeAdmin}