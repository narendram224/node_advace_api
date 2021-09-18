import ErrorHandler from "../Utils/errorHandler";
import catchAsyncError from "./catchAsyncError";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config";
import { User } from "../model";
export const  isAuthenticatedUser = catchAsyncError(async (req, res,next) => {
    const {token} = req.cookies;
    console.log("token", token);
    if(!token) {
        return next(new ErrorHandler('Please login to access this feature',401))
    }
    const decode = jwt.verify(token,JWT_SECRET)
    req.user = await User.findById(decode.id)
    next()

})

export default isAuthenticatedUser;
export const authorizeRoles  = (...roles)=>(req, res,next)=>{
        if(!roles.includes(req.user.role)) {
           return next( new ErrorHandler(`Role(${req.user.role}) not allowed to access this feature`,403))
        }

        next();
}