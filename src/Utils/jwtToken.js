import { COOKIE_EXPIRES_TIME } from "../config";

const sendToken =(user,statusCode,res)=>{

    // create jwt tokens
    const token  =  user.getJwtToken();
    // options
    const options = {
        expires:new Date(Date.now()+COOKIE_EXPIRES_TIME*24*60*60*1000),
        httpOnly:true
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
}
export default sendToken