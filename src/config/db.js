import mongoose from 'mongoose'
import { DB_URI } from '.'
import logger from '../Helper/logger'

const connectDatabase =async ()=>{
    // try {
        await mongoose.connect(DB_URI);
        logger.info('Database connected successfully!')
      // } 
      // catch (error) {
      //   console.log(error);
      //   handleError(error)
      // }

}
const handleError  =(err)=>{
        logger.error(err)
}

export default connectDatabase;