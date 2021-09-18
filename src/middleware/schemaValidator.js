import Joi from "joi";
import logger from "../Helper/logger";



const schemaValidator = (schema, property) => { 
  return (req, res, next) => { 
  const { error } = schema.validate(req.body); 
  const valid = error == null; 

  if (valid) { 
    next(); 
  } else { 
    const { details } = error; 
    // console.log("detail",details);
    const message = details.map(i => i.message).join(',');

    logger.error(message); 
    next(error); 
   } 
  } 
} 
export default schemaValidator;