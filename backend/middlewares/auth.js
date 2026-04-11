import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";
const  auth = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorization());
    }
    const token = authHeader.split(' ')[1];
    
    try {
        const {_id, role} = JwtService.verify(token);
        req.user = {
            _id,
            role
        }        
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorization());

    }
}

export default auth;