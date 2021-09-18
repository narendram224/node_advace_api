import { catchAsyncError } from "../../middleware";
import {  Review } from "../../model";
import { APIFeature, ErrorHandler } from "../../Utils";
// add new ordeer api/v1/order/new
const reviewController ={
    newReview:catchAsyncError( async (req,res,next) => {
        res.status(200).json({success:true})
    })
}

export default reviewController