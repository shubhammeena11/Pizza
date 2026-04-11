import {User} from "../models/index.js";

const admin = async (req,res,next)=>{

  try {
     const user = await User.findOne({_id : req.user._id})
     
          if(user.role === "admin"){
              next();
          }
          else{
              return res.status(403).json({msg:"Access denied"});
          }
  } catch (error) {
    return next (error);
  }
    
}

export default admin;