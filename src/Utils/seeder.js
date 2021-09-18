import connectDatabase from "../config/db";
import logger from "../Helper/logger";
import { Product } from "../Model";
import product from '../data/product.json'

connectDatabase()

const seederProduct =async()=>{
    try {
        await Product.deleteMany();
        logger.info("Product deleted")
        await Product.insertMany(product);
        logger.info("Product inserted")
        process.exit();

    } catch (error) {
        logger.error(error);
        process.exit();
    }
    
}

seederProduct();