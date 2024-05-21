const express = require("express");
const { ShoeCollection } = require("../models/shoeCollection");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// CREATE ShoeCollections
router.post("/", isAdmin, async (req, res) => {
  const { name, type, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "apadana-group",
      });

      if (uploadRes) {
        const shoeCollection = new ShoeCollection({
          name,
          type,
          desc,
          price,
          image: uploadRes,
        });

        const savedShoeCollection = await shoeCollection.save();
        res.status(200).send(savedShoeCollection);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ALL ShoeCollections
router.get("/", async (req, res) => {
  const qtype = req.query.type;
  try {
    let shoeCollections;

    if (qtype) {
      shoeCollections = await ShoeCollection.find({ type: qtype });
    } else {
      shoeCollections = await ShoeCollection.find();
    }

    res.status(200).json(shoeCollections);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching Shoe collections.");
  }
});

// GET ShoeCollection by ID
router.get("/find/:id", async (req, res) => {
  try {
    const shoeCollection = await ShoeCollection.findById(req.params.id);
    res.status(200).send(shoeCollection);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE ShoeCollection
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await ShoeCollection.findByIdAndDelete(req.params.id);
    res.status(200).send("Shoe collection has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE ShoeCollection
router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.image) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.image.public_id
    );

    if (destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.image,
        {
          upload_preset: "apadana-group",
        }
      );

      if (uploadedResponse) {
        const updatedShoeCollection = await ShoeCollection.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body,
              image: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updatedShoeCollection);
      }
    }
  } else {
    try {
      const updatedShoeCollection = await ShoeCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).send(updatedShoeCollection);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

module.exports = router;
