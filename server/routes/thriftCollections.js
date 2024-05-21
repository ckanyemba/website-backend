const express = require("express");
const { ThriftCollection } = require("../models/thriftCollection");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// CREATE ThriftCollection
router.post("/", isAdmin, async (req, res) => {
  const { name, type, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "apadana-group",
      });

      if (uploadRes) {
        const thriftCollection = new ThriftCollection({
          name,
          type,
          desc,
          price,
          image: uploadRes,
        });

        const savedThriftCollection = await thriftCollection.save();
        res.status(200).send(savedThriftCollection);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ALL ThriftCollections
router.get("/", async (req, res) => {
  const qtype = req.query.type;
  try {
    let thriftCollections;

    if (qtype) {
      thriftCollections = await ThriftCollection.find({ type: qtype });
    } else {
      thriftCollections = await ThriftCollection.find();
    }

    res.status(200).json(thriftCollections);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching thrift collections.");
  }
});

// GET ThriftCollection by ID
router.get("/find/:id", async (req, res) => {
  try {
    const thriftCollection = await ThriftCollection.findById(req.params.id);
    res.status(200).send(thriftCollection);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE ThriftCollection
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await ThriftCollection.findByIdAndDelete(req.params.id);
    res.status(200).send("Thrift collection has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE ThriftCollection
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
        const updatedThriftCollection = await ThriftCollection.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body,
              image: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updatedThriftCollection);
      }
    }
  } else {
    try {
      const updatedThriftCollection = await ThriftCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).send(updatedThriftCollection);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

module.exports = router;
