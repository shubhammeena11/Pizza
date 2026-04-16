import {User, RefreshToken} from '../../models/index.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';


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
    },

    async update(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).min(6).max(30).optional(),
            repeat_password: Joi.any().valid(Joi.ref('password')).when('password', {
                is: Joi.exist(),
                then: Joi.required(),
                otherwise: Joi.forbidden(),
            }),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }

            if (req.body.email && req.body.email !== user.email) {
                const exists = await User.findOne({ email: req.body.email });
                if (exists) {
                    return next(CustomErrorHandler.alreadyExists('Email is already in use.'));
                }
                user.email = req.body.email;
            }

            if (req.body.name) {
                user.name = req.body.name;
            }

            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            await user.save();
            const updatedUser = await User.findById(req.user._id).select("-password -updatedAt -__v");
            res.json(updatedUser);
        } catch (error) {
            return next(error);
        }
    },
};

export default userController;