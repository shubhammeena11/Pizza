import { Readable } from "stream";
import multer from "multer";
import Joi from "joi";
import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const storage = multer.memoryStorage();
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 5 * 1000000 },
}).single("image");

const uploadToCloudinary = (buffer, folder = "erp_products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    Readable.from(buffer).pipe(stream);
  });
};

const extractCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:$|\?)/);
  return match ? match[1] : null;
};

// ---------------- CONTROLLER ----------------
const productController = {
  // ✅ CREATE PRODUCT
  async store(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      if (!req.file) {
        return next(CustomErrorHandler.badRequest("Image is required"));
      }

      const filepath = req.file.path.replace(/\\/g, "/");

      const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        return next(error);
      }

      const { name, price, size } = req.body;

      let uploadResult;
      try {
        uploadResult = await uploadToCloudinary(req.file.buffer);
      } catch (uploadError) {
        return next(CustomErrorHandler.serverError(uploadError.message));
      }

      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: uploadResult.secure_url,
        });
      } catch (error) {
        return next(error);
      }

      res.status(201).json({
        msg: "Product created successfully",
        document,
      });
    });
  },

  // ✅ UPDATE PRODUCT
  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      const { id } = req.params;
      const { name, price, size } = req.body;

      if (!id) {
        return next(CustomErrorHandler.badRequest("Product ID is required"));
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(CustomErrorHandler.badRequest("Invalid product ID"));
      }

      let product;
      try {
        product = await Product.findById(id);
        if (!product) {
          return next(CustomErrorHandler.notFound("Product not found"));
        }
      } catch (error) {
        return next(error);
      }

      if (req.file && product.image) {
        const publicId = extractCloudinaryPublicId(product.image);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
          } catch (err) {
            console.log("Cloudinary delete error:", err.message);
          }
        }
      }

      let imageUrl = product.image;
      if (req.file) {
        try {
          const uploadResult = await uploadToCloudinary(req.file.buffer);
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          return next(CustomErrorHandler.serverError(uploadError.message));
        }
      }

      const newData = {
        name,
        price,
        size,
        image: imageUrl,
      };

      let updated;
      try {
        updated = await Product.findByIdAndUpdate(id, newData, {
  returnDocument: 'after'
});
      } catch (error) {
        return next(error);
      }

      res.json({
        msg: "Product updated successfully",
        document: updated,
      });
    });
  },

  // ✅ DELETE PRODUCT
  async delete(req, res, next) {
    const { id } = req.params;

    if (!id) {
      return next(CustomErrorHandler.badRequest("Product ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(CustomErrorHandler.badRequest("Invalid product ID"));
    }

    let document;
    try {
      document = await Product.findByIdAndDelete(id);

      if (!document) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }
    } catch (error) {
      return next(error);
    }

    if (document.image) {
      const publicId = extractCloudinaryPublicId(document.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
        } catch (err) {
          console.log("Cloudinary delete error:", err.message);
        }
      }
    }

    res.json({
      msg: "Product deleted successfully",
      document,
    });
  },

  // ✅ GET ALL PRODUCTS (with pagination)
  async getAll(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // 🔍 filters
  const { minPrice, maxPrice, size, search, sort } = req.query;

  let filter = {};

  // ✅ price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // ✅ size filter
  if (size) {
    filter.size = size;
  }

  // ✅ search (name)
  if (search) {
    filter.name = { $regex: search, $options: "i" }; // case-insensitive
  }

  // ✅ sorting
  let sortOption = {};
  if (sort === "price") sortOption.price = 1;
  if (sort === "-price") sortOption.price = -1;
  if (sort === "name") sortOption.name = 1;

  let products;
  let totalCount;
  try {
    products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);
    
    totalCount = await Product.countDocuments(filter);
  } catch (error) {
    return next(error);
  }

  res.json({
    page,
    limit,
    count: products.length,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    filters: filter,
    data: products,
  });
},

  // ✅ GET SINGLE PRODUCT
  async getSingle(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(CustomErrorHandler.badRequest("Invalid product ID"));
    }

    let product;
    try {
      product = await Product.findById(id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }
    } catch (error) {
      return next(error);
    }

    res.json(product);
  }
};

export default productController;