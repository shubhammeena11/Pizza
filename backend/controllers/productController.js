import multer from "multer";
import path from "path";
import fs from "fs/promises";
import Joi from "joi";
import mongoose from "mongoose";

import { Product } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

// ---------------- MULTER SETUP ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 5 * 1000000 },
}).single("image");

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
        // delete uploaded file if validation fails
        try {
          await fs.unlink(path.join(global.appRoot, filepath));
        } catch (e) {
          console.log("Cleanup error:", e.message);
        }
        return next(error);
      }

      const { name, price, size } = req.body;

      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filepath,
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

      // delete old image if new uploaded
      if (req.file && product.image) {
        const oldImagePath = path.join(global.appRoot, product.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.log("Old image delete error:", err.message);
        }
      }

      const newData = {
        name,
        price,
        size,
        ...(req.file && {
          image: req.file.path.replace(/\\/g, "/"),
        }),
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

    // delete image
    if (document.image) {
      const imagePath = path.join(global.appRoot, document.image);

      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log("Image delete error:", err.message);
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