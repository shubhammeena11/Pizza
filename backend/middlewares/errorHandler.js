import {DEBUG_MODE} from '../config/index.js';
import Joi from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler.js';


const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message:'Internal Server Error',
       ...( DEBUG_MODE=== 'true' && {originalMessage: err.message})
    }

    if(err instanceof Joi.ValidationError){
        statusCode = 422;
        data.message = err.message
    }

    if(err instanceof CustomErrorHandler){
        statusCode = err.status;
        data.message = err.message;
    }

    return res.status(statusCode).json(data);
    
}

export default errorHandler;