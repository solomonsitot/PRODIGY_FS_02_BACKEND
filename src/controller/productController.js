const Product = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) return res.status(404).send("products not found");
    res.send(products);
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getAllProductsOfOneShop = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.find({ shop_owner: id });
    if (!products) return res.status(404).send("products not found");
    res.json(products);
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).send("product not found");
    res.send(product);
  } catch (error) {
    console.error("Error fetching Shop:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.searchProduct = async (req, res) => {
  try {
    const { role } = req.user;
    const { key } = req.params;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to see product" });
    }
    const products = await Product.find({
      product_name: { $regex: new RegExp(key, "i") },
    });
    res.json(products).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getMyProducts = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role != "shop owner") {
      return res.json({ message: "you are not allowed to see products" });
    }
    const products = await Product.find({ shop_owner: id });
    res.json(products).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.createProducts = async (req, res) => {
  try {
    // const { error } = validateProduct(req.body);
    // if (error) {
    //   const errorMessage = error.details[0].message;
    //   return res.status(400).send(errorMessage);
    // }
    const { role, id } = req.user;
    const {
      product_name,
      product_description,
      product_price,
      product_quantity,
    } = req.body;
    const { image1, image2, image3 } = req.files;
    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;
    if (
      !product_name ||
      !image1 ||
      !image2 ||
      !image3 ||
      !product_description ||
      !product_price ||
      !product_quantity
    ) {
      return res.json({ message: "all fields are required" }).satus(400);
    }
    if (role != "shop owner") {
      return res.json({ message: "you are not allowed to create shops" });
    }
    const product = {
      shop_owner: id,
      product_name: product_name,
      product_images: [Image1, Image2, Image3],
      product_description: product_description,
      product_price: product_price,
      product_quantity: product_quantity,
      product_available: product_quantity,
    };
    await Product.create(product);
    res.json(product); // Send back updated products array
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { role, id } = req.user;
    const pid = req.params.id;
    const {
      product_name,
      product_description,
      product_price,
      product_quantity,
    } = req.body;
    const files = req.files;

    // if (
    //   !product_name ||
    //   !image1 ||
    //   !image2 ||
    //   !image3 ||
    //   !product_description ||
    //   !product_price ||
    //   !product_quantity
    // ) {
    //   return res.json({ message: "all fields are required" }).satus(400);
    // }
    if (role != "shop owner") {
      return res.json({ message: "you are not allowed to update products" });
    }

    const product = await Product.findById(pid);
    if (!product) return res.status(404).send("product not found");
    if (product.shop_owner != id) {
      return res.json({
        message: "you are only allowed to update your products",
      });
    }

    let image1URL = product.product_images[0];
    let image2URL = product.product_images[1];
    let image3URL = product.product_images[2];

    if (files && files.image1) {
      const image1Upload = await cloudinary.uploader.upload(
        files.image1[0].path
      );
      image1URL = image1Upload.secure_url;
    }
    if (files && files.image2) {
      const image2Upload = await cloudinary.uploader.upload(
        files.image2[0].path
      );
      image2URL = image2Upload.secure_url;
    }
    if (files && files.image3) {
      const image3Upload = await cloudinary.uploader.upload(
        files.image3[0].path
      );
      image3URL = image3Upload.secure_url;
    }

    product.product_name = product_name || product.product_name;
    product.product_images[0] = image1URL;
    product.product_images[1] = image2URL;
    product.product_images[2] = image3URL;
    product.product_description =
      product_description || product.product_description;
    product.product_price = product_price || product.product_price;
    product.product_amount = product_quantity || product.product_amount;
    await product.save();
    res
      .json({ message: "product updated sucessfully", body: product })
      .status(200);
  } catch (err) {
    res.json({ message: err.message });
    console.log(err.message);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { role, id } = req.user;
    const pid = req.params.id;
    if (role != "shop owner") {
      return res.json({ message: "you are not allowed to delete product" });
    }
    const product = await Product.findById(pid);
    console.log(product);
    if (!product) return res.status(404).send("product not found");
    if (product.shop_owner != id) {
      return res.json({
        message: "you are only allowed to update your product",
      });
    }
    await product.deleteOne();
    res.json({ message: "product deleted successfully" }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
