import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    shippingInfo:{
        address: {
            type:String,
            required:[true,"Address is required"],
        },
        city: {
            type:String,
            required:[true,"City is required"],
        },
        mobileNo:{
            type:String,
            required:[true,"PhoneNo is required"],
        },
        postalCode:{
            type:String,
            required:[true,"PostalCode is required"]
        },
        country: {
            type:String,
            required:[true,"Country is required"]
        }
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    orderItems:[
        {
           name:{
             type:String,
            required:true,
        },
        
         quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        product:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Product'
        }

        }
    
    ],
    paymentInfo:{
        id:{
            type:String,
            required:true,

        },
        status:{
            type:String,
            required:true
        }
    },
    paidAt:{
        type:Date
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
        required:true,
        default:'Processing'
    },
    deliveredAt:{
        type:Date
    },
    
},{
  timestamps: true
})

export default mongoose.model('Order',OrderSchema)