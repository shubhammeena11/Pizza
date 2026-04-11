import Joi from "joi";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
import { User, RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const loginController = {
  async login(req, res, next) {

    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .min(6)
        .max(30)
        .required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { email, password } = req.body;

    let user;

    try {
      user = await User.findOne({ email: email });

      if (!user) {
        return next(
          CustomErrorHandler.wrongCredentials("email is not registered"),
        );
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return next(
          CustomErrorHandler.wrongCredentials("password is incorrect"),
        );
      }
    } catch (error) {
      return next(error);
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

    res.json({ msg: "Login successfully", access_token , refresh_token });
  },

  async logout(req, res, next) {

  const refreshSchema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  const { error } = refreshSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  let result;

  try {
    result = await RefreshToken.deleteOne({
      token: req.body.refresh_token
    });
  } catch (error) {
    return next(error);
  }

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "Refresh token not found"
    });
  }

  res.status(200).json({
    message: "Logout Successfully"
  });
}
};

export default loginController;
