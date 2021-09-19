import { catchAsyncError } from "../../middleware";
import { Product } from "../../model";
import { APIFeature, ErrorHandler } from "../../Utils";



const productController ={
// get all products  api/v1/product/new

getProduct:catchAsyncError( async (req,res,next)=>{
    const resultPerpage =4;
    const totalCount = await  Product.countDocuments()
        const apifeature = new APIFeature(Product.find(),req.query)
                                .search()
                                .filter()
                                .pagination(resultPerpage);
        const product = await apifeature.query;
        res.status(200).json({
            success: true,
            count:product.length,
            productCount:totalCount, 
            product
        })
    }),
// add new product  api/v1/admin/product/new
  newProduct:catchAsyncError( async (req,res,next)=>{
      req.body.user = req.user.id;
        const product =await  Product.create(req.body);
        res.status(200).json({
            success: true,
            product,
        })
    }),

// add new product  api/v1/product/new
getSingleProduct:catchAsyncError( async (req,res,next)=>{
    const {id} = req.params;
    const product =await  Product.findById(id);
    if (!product) {
            return next(new ErrorHandler("Product not fount",404))
    }
    res.status(200).json({
        success: true,
        product,
    })
}),
// update the product  api/v1/admin/product/:id
updateProduct:catchAsyncError( async (req,res,next)=>{
    const {id} = req.params;
    let product =await  Product.findById(id);
    if (!product) {
            return next(new ErrorHandler("Product not fount!",404))
    }
   product = await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true,useFindAndModify:false});

   res.status(200).json({
       success: true,
       product
   })
}),

// delete the product  api/v1/admin/product/:id
deleteProduct: catchAsyncError( async (req,res,next)=>{
    const {id} = req.params;
    let product =await  Product.findById(id);
    if (!product) {
            return next(new ErrorHandler("Product not fount!",404))
    }
    await product.remove();
   res.status(200).json({
       success: true,
   })
}),
// create product review  -> api/v1/product/review
createProductReview:catchAsyncError( async (req,res,next) => {
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId)
// check user is already review on this product is reviewd?then update the review: create a product
    const isReviewed = product.reviews.find((r)=>r.user.toString() === req.user.id.toString())
    console.log("the product is " , isReviewed);

    if (isReviewed) {
        product.reviews.forEach((review)=>{
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }
    console.log("the product reiview",product.reviews);
    product.ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0) / product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success: true,
        message: 'successfully added review'
    })

}),
// create product review  -> api/v1/product/review/:id
getProductReview:catchAsyncError( async (req,res,next) => {
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            success: true,
            reviews:product.reviews,
            total:product.reviews.length
        })
}),
// delete  product review  -> api/v1/product/review/:id
deleteProductReview:catchAsyncError( async (req,res,next) => {
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(review =>review._id.toString()!==req.query.id.toString().trim())
    const ratings = product.reviews.reduce((acc,review) => review.rating+acc,0) / reviews.length;
    const numOfReviews = reviews.length;
    // console.log("query",req.query.id,reviews._id);

    // console.log("the review is",reviews,ratings,numOfReviews);

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{new:true,runValidators:true,useFindAndModify:false})



    res.status(200).json({
        success: true,
        message:"Successfully delete review"
    })
})
}

export default productController;