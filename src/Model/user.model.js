import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { JWT_EXPIRES_TIME, JWT_SECRET } from '../config';

const Schema = mongoose.Schema
const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const UserSchema = new Schema({
    name:{
        type: String,
        required: [true,"Please enter the user name"],
        maxlength:[30,'Your name cannot exceed 30 characters']
    },
    email:{
        type: String,
        required: [true,"Please enter the email "],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        required: [true,"Please enter the password"],
        minlength:[6,'Password must be longer than 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user',
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
       
},{timestamps:true})

// Encrypt the password before sending it to the server

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10);

} )
// Return Json web tokens

UserSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_TIME})

}
// Compare Password 
UserSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
// generate password reset tokens
UserSchema.methods.getResetPasswordToken = function(){
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //  hash  set to reset password
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set token expires time
    this.resetPasswordExpire = Date.now() +30*60*1000;
    return resetToken
}

export default mongoose.model('User',UserSchema)