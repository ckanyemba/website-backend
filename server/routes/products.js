const express = require("express");
const { Product } = require("../models/product");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

//CREATE
router.post("/", isAdmin, async (req, res) => {
  const { name, type, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "apadana-group",
      });

      if (uploadRes) {
        const product = new Product({
          name,
          type,
          desc,
          price,
          image: uploadRes,
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qtype = req.query.type;
  try {
    let products;

    if (qtype) {
      products = await Product.find({ type: qtype });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
});

// GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send("Product has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});

// EDIT a product by ID
router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.product.image.public_id,
    );

    if(destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "apadana-group",
        }
      );

      if(uploadedResponse)
      {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ... req.body.product,
              image: uploadedResponse,
           },
          },
          { new: true }
        );

        res.status(200).send(updatedProduct);
      }
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        {
          new: true
        }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

// UPDATE

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
