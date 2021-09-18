
import { catchAsyncError } from "../../middleware";
import { Order, Product } from "../../model";
import { APIFeature, ErrorHandler } from "../../Utils";
// add new ordeer api/v1/order/new
const orderController ={
    newOrder:catchAsyncError( async (req,res,next) => {
            const {
                orderItems,
                shippingInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentInfo,
            } = req.body;
            const order = await Order.create({
                orderItems,
                shippingInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentInfo,
                paidAt:Date.now(),
                user:req.user.id,
            })

            res.status(201).json({success: true, order})

    }),
    // get single order api/v1/order/:id
    singleOrder:catchAsyncError( async (req,res,next) => {

        const order = await Order.findById(req.params.id).populate('user','name email')

        if(!order){
            return next(new ErrorHandler("No order found with this id",404))
        }
        res.status(200).json({success: true, order})

    }),
    // my order api/v1/orders/me
    myOrder:catchAsyncError(async (req,res,next) => {
            const orders = await Order.find({user:req.user.id})
            if(orders.length===0){
               return next(new ErrorHandler("No order found",404))
            }
            res.status(200).json({success: true,orders})
    
    }),
    // my order api/v1/admin/orders/
    getAllOrders:catchAsyncError(async (req,res,next) => {
        const resultPerpage=4;
        let totalAmount = 0;

        const apifeature =  new APIFeature(Order.find(),req.query)
        .search()
        .filter()
        .pagination(resultPerpage);
        const orders = await apifeature.query;
        if(orders.length===0){
           return next(new ErrorHandler("No order found",404))
        }
        // calculate total amount
        totalAmount =  orders.reduce((acc,current)=>acc + current.totalPrice,0)
        console.log("titles: " + totalAmount);
        res.status(200).json({success: true,orders,totalAmount})

}),
   // update order api/v1/admin/order/:id
   updateOrder:catchAsyncError(async (req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
      return next(new ErrorHandler("No order found",404))
    }
    if (order.orderStatus==="Delivered") {
            return next(new ErrorHandler("You have already delivered this order",404))
    }
    order.orderItems.forEach( async item=>{
        await updateStock(item.product,item.quantity)
    })
    order.orderStatus = req.body.status;
    order.deliveredAt =Date.now()
    await order.save();
   
    res.status(200).json({success: true})

}),
// delete order api/v1/admin/order/:id
deleteOrder:catchAsyncError(async (req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("No order found",404))
    }
    await order.remove();
    res.status(200).json({success: true,message:"Order is deleted successfully"})

})

}
async function updateStock(id,quantity){
    const product = await  Product.findById(id)
    product.stock -=quantity;
    await product.save({validateBeforeSave:false});
}
export default  orderController