const express = require("express");
const { ArticleCollection } = require("../models/articleCollection");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// CREATE ArticleCollection
router.post("/", isAdmin, async (req, res) => {
  const { name, type, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "apadana-group",
      });

      if (!uploadRes) throw new Error("Failed to upload image.");

      const ArticleCollection = new ArticleCollection({
        name,
        type,
        desc,
        price,
        image: uploadRes,
      });

      const savedArticleCollection = await ArticleCollection.save();
      res.status(200).send(savedArticleCollection);
    } else {
      throw new Error("No image provided.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

// GET ALL ArticleCollections
router.get("/", async (req, res) => {
  const qtype = req.query.type;
  try {
    let ArticleCollections;

    if (qtype) {
      ArticleCollections = await ArticleCollection.find({ type: qtype });
    } else {
      ArticleCollections = await ArticleCollection.find();
    }

    res.status(200).json(ArticleCollections);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while fetching products." });
  }
});

// GET ArticleCollection by ID
router.get("/find/:id", async (req, res) => {
  try {
    const ArticleCollection = await ArticleCollection.findById(req.params.id);
    res.status(200).send(ArticleCollection);
  } catch (error) {
    res.status(404).send({ message: "ArticleCollection not found." });
  }
});

// DELETE ArticleCollection
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await ArticleCollection.findByIdAndDelete(req.params.id);
    res.status(200).send("ArticleCollection has been deleted...");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// EDIT a ArticleCollection by ID
router.put("/:id", isAdmin, async (req, res) => {
  try {
    if (req.body.ArticleCollectionImg) {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.ArticleCollection.image.public_id,
      );

      if (!destroyResponse ||!req.body.ArticleCollectionImg) throw new Error("Failed to delete old image or no new image provided.");

      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.ArticleCollectionImg,
        {
          upload_preset: "apadana-group",
        }
      );

      if (!uploadedResponse) throw new Error("Failed to upload new image.");

      const updatedArticleCollection = await ArticleCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
           ...req.body.ArticleCollection,
            image: uploadedResponse,
          },
        },
        { new: true }
      );

      res.status(200).send(updatedArticleCollection);
    } else {
      const updatedArticleCollection = await ArticleCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.ArticleCollection,
        },
        {
          new: true
        }
      );
      res.status(200).send(updatedArticleCollection);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
