import Joi from "joi";
import {RefreshToken, User} from "../../models/index.js";
import JwtService from "../../services/JwtService.js";
import {REFRESH_SECRET} from '../../config/index.js';
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    let refreshtoken;
    try {
        refreshtoken = await RefreshToken.findOne({ token : req.body.refresh_token});
        if(!refreshtoken){
            return next(CustomErrorHandler.unAuthorization("Invalid refresh token"));
        }
        let userId;
        try {
            const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_SECRET);
            userId = _id;
        } catch (error) {
            return next(CustomErrorHandler.unAuthorization("Invalid refresh token"));
        }
        
        const user = await User.findOne({_id : userId});
        if(!user){
            return next(CustomErrorHandler.unAuthorization("no user found"));
        }

         const access_token = JwtService.sign({
              _id: user._id,
              role: user.role,
            });
        
            const refresh_token = JwtService.sign(
              { _id: user._id, role: user.role },
              "1y",
              REFRESH_SECRET,
            );
        
            
            await RefreshToken.create({ token: refresh_token });

            try {
              await RefreshToken.deleteOne({token : refreshtoken.token})
            } catch (error) {
              return next(error);
            }
            
            res.json({ msg: "Login successfully", access_token , refresh_token });

    } catch (error) {
      return next(error);
    }
  },

};

export default refreshController;
