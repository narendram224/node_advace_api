import { catchAsyncError } from "../../middleware";
import { User } from "../../model";
import ErrorHandler from "../../Utils/errorHandler";
import sendToken from "../../Utils/jwtToken";
import sendEmail from "../../Utils/sendEmail";
import crypto from 'crypto'
import { APIFeature } from "../../Utils";

const userController  ={
    register:catchAsyncError( async (req,res,next) => {
    const {email,name,password} = req.body;
            // const existUser = User.exists(email);

            const user = await User.create({
                email,
                name,
                password,
                avatar:{
                    public_id:"avatar/adadad",
                    url:'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-math-90946.jpg&fm=jpg'
                }
            })
            
            // create secure cookie token
            sendToken(user,200,res);
            
   
}),
login:catchAsyncError( async (req,res,next)=>{
        const {email,password} = req.body;
        // checking email   and password is exist
        if(!email || !password){
            return next(new ErrorHandler('Please Enter the email & password',400));
        }
        // Finding user into db
        const user = await User.findOne({email}).select('+password'); 
        if(!user){
            return next(new ErrorHandler('Email is not registered',401));
        }
        // checking the password

        const isPasswordMatch = await user.comparePassword(password)
        if(!isPasswordMatch){
            return next(new ErrorHandler('Password is not correct',401))
        }
        sendToken(user,200,res);
}),
// logout user /api/v1/logout
logout:catchAsyncError( async (req,res,next) => {
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Successfully logout'
    })
}),
// forget password /api/v1/forget
forgetPassword : catchAsyncError( async (req,res,next)=>{
    const email = req.body.email;
    const user = await User.findOne({ email})
    if (!user) {
            return next(new ErrorHandler('User not found',404));
    }
    // get reset tokens
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})
    // create reset password Url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token as follows:\n\n ${resetUrl}\n\n If your are not requesting a reset password 
    Please ignore this`;
    try {
        
        await sendEmail({email:user.email,subject:"Shop Password recovery",message:message})
        res.status(200).json({
            success: true,
            message:`Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken =undefined;
        user.resetPasswordExpire =undefined;
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message  ,500))
    }

}),
// reset password => api/v1/password/reset/:token
resetPassword:catchAsyncError( async (req,res,next) => {
    // hash reset token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // fetch user for that tokens
    const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    if (!user) {
        return next(new ErrorHandler("password reset token is invalid or expired",400));
    }
    if(req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not match with confirmPassword",400))
    }
    // Setup new Password
    user.password = req.body.password;
    user.resetPasswordToken =undefined;
    user.resetPasswordExpire =undefined;
    await user.save()
    sendToken(user,200,res);

}),
// Get user profile => api/v1/me
getUserProfile:catchAsyncError( async (req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true,user})
}),
// update passowrd /api/v1/password/update
updatePassword:catchAsyncError( async (req,res,next) =>{
    const user = await User.findById(req.user.id).select('+password');
    // check previous password
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if(!isMatch) {
        return next(new ErrorHandler('Old password is incorrect',401))
    }
    user.password = req.body.password;
    user.save()
    sendToken(user,200,res);
}),
// Get all users => api/v1/admin/users
allUsers :catchAsyncError( async (req,res,next) => {
    // const users = await User.find();
    // res.status(200).json({
    //     success:true,
    //     users,
    //     total:
    // })


    const resultPerpage =4;
    const totalCount = await  User.countDocuments()
        const apifeature = new APIFeature(User.find(),req.query)
                                .search()
                                .filter()
                                .pagination(resultPerpage);
        const users = await apifeature.query;
        res.status(200).json({
            success: true,
            count:users.length,
            productCount:totalCount, 
            users
        })
}),
// Get all users => api/v1/admin/users
getUserDetails :catchAsyncError( async (req,res,next) => {
    const users = await User.findById(req.params.id);
    if(!users){
        return next(new ErrorHandler(`User does not exist: ${req.params.id}`,404));
    }
    res.status(200).json({
        success:true,
        users
    })
}),
// Update profile api/me/update
updateProfile:catchAsyncError( async (req,res,next) => {
        const userUserData ={
            name:req.body.name,
            email:req.body.email
        }
        // update user profile here

        const user = await User.findByIdAndUpdate(req.user.id,userUserData,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        res.status(200).json({
            success:true,

        })
}),
// Update profile api/admin/user/:id
updateProfileByAdmin:catchAsyncError( async (req,res,next) => {
    const userUserData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    // update user profile here

    const user = await User.findByIdAndUpdate(req.params.id,userUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,

    })
}),
deleteUser:catchAsyncError( async (req,res,next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        res.status(404).json({
            success:false,
            message: 'User not found'
        })
    }
    // delete avatar imag :TODO
     await User.findByIdAndDelete(id);
     res.status(200).json({
         success:true,
        message: 'User deleted successfully'
     })

})


}

export default userController;