import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
        name:{
            type:String,
            required:[true,"Please enter the product name"],
            trim:true,
            maxlength:[100,'Product name cannot exceed 100 characters'],
        },
        price:{
            type:Number,
            required:[true,"Please enter the product price"],
            default:0.0 ,          
            maxlength:[5,'Product name cannot exceed 5 characters'],
        }, 
        description:{
            type:String,
            required:[true,"Please enter the product description"],
        },
         ratings:{
            type:Number,
           default:0
        },
        images:[{
            public_id:{
                type:String,
                required:true,
            },
                url:{
                    type:String,
                    required:true,  
                }
            
        }],
        category:{
            type:String,
            required:[true,"Please select the category for the product"],
            enum:{
                values:['Electronics','Camera','Accessories','Headphones','Food','Books','Clothes/Shoes','Beauty/Health','Sports','Outdoor','Home'],
                message:"Please select the correct cotegory for product"
            }

        },
        seller:{
            type:String,
            required:[true,"Please enter the product seller"],

        },
        stock:{
            type:Number,
            required:[true,"Please enter the product stock"],
            maxlength:[5,'Product stock cannot exceed 5 characters'],
            default:0,

        },
        numOfReviews:{
            type:Number,
            default:0,
            
        },
        reviews:[
            {
                name:{
                    type:String,
                    required:true,
                },
                rating:{
                    type:Number,
                    required:true,

                },
                comment:{
                    type:String,
                        required:true,
                }
            }
        ],
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        }
},{timestamp:true})

export default mongoose.model('Product',productSchema)