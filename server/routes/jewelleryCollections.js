const express = require("express");
const { JewelleryCollection } = require("../models/jewelleryCollection");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// CREATE JewelleryCollection
router.post("/", isAdmin, async (req, res) => {
  const { name, type, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "apadana-group",
      });

      if (uploadRes) {
        const jewelleryCollection = new JewelleryCollection({
          name,
          type,
          desc,
          price,
          image: uploadRes,
        });

        const savedJewelleryCollection = await jewelleryCollection.save();
        res.status(200).send(savedJewelleryCollection);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ALL JewelleryCollections
router.get("/", async (req, res) => {
  const qtype = req.query.type;
  try {
    let jewelleryCollections;

    if (qtype) {
      jewelleryCollections = await JewelleryCollection.find({ type: qtype });
    } else {
      jewelleryCollections = await JewelleryCollection.find();
    }

    res.status(200).json(jewelleryCollections);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
});


// GET JewelleryCollection by ID
router.get("/find/:id", async (req, res) => {
  try {
    const jewelleryCollection = await JewelleryCollection.findById(req.params.id);
    res.status(200).send(jewelleryCollection);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE JewelleryCollection
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await JewelleryCollection.findByIdAndDelete(req.params.id);
    res.status(200).send("Jewellery collection has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});


// EDIT a JewelleryCollection by ID
router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.jewelleryCollectionImg) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.jewelleryCollection.image.public_id,
    );

    if(destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.jewelleryCollectionImg,
        {
          upload_preset: "apadana-group",
        }
      );

      if(uploadedResponse)
      {
        const updatedJewelleryCollection = await JewelleryCollection.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ... req.body.jewelleryCollection,
              image: uploadedResponse,
           },
          },
          { new: true }
        );

        res.status(200).send(updatedJewelleryCollection);
      }
    }
  } else {
    try {
      const updatedJewelleryCollection = await JewelleryCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.jewelleryCollection,
        },
        {
          new: true
        }
      );
      res.status(200).send(updatedJewelleryCollection);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

// UPDATE JewelleryCollection

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedJewelleryCollection = await JewelleryCollection.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedJewelleryCollection);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
