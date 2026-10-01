import { User, Product } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const favoriteController = {
  async add(req, res, next) {
    try {
      const productId = req.params.id;

      const product = await Product.findById(productId);

      if (!product) {
        return next(CustomErrorHandler.notFound());
      }
      const user = await User.findById(req.user._id);

    if (!user) {
      return next(CustomErrorHandler.notFound());
    }

    if (user.favorites.some(id => id.toString() === productId)) {
    return res.status(400).json({
        message: "Product already added to favorites"
    });
}
user.favorites.push(productId);

await user.save();

return res.status(200).json({
    message: "Product added to favorites"
});


    } catch (error) {
      return next(error);
    }

    
  },
  
  async remove(req,res,next){

    try {
      const productId = req.params.id;

      const product = await Product.findById(productId);

      if (!product) {
        return next(CustomErrorHandler.notFound());
      }
      const user = await User.findById(req.user._id);

    if (!user) {
      return next(CustomErrorHandler.notFound());
    }

    if (user.favorites.some(id => id.toString() === productId)) {
        user.favorites.pull(productId);
        await user.save();
   return res.status(200).json({
    message: "Product id removed from favorites"
});
}

return res.status(400).json({
    message: "Product is not in favorites"
});

 
    } catch (error) {
      return next(error);
    }


  },

  async getAll(req,res,next){

    try {
        const user = await User.findById(req.user._id)
            .populate("favorites");

        if (!user) {
            return next(CustomErrorHandler.notFound());
        }

        return res.status(200).json(user.favorites);

    } catch (error) {
        return next(error);
    }
  },
};

export default favoriteController;
