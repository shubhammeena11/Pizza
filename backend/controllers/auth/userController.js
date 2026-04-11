import {User, RefreshToken} from '../../models/index.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js';


const userController = {
    async me(req, res, next) {
        let user;
        try {
            user = await User.findOne({_id: req.user._id}).select("-password -updatedAt -__v");
            if(!user){
                return next(CustomErrorHandler.notFound());
            }
            res.json(user)
        } catch (error) {
            return next(error);
        }
    }
}

export default userController;