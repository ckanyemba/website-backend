const express = require("express");
const { PostCollection } = require("../models/postCollection");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// CREATE PostCollection
router.post('/', isAdmin, async (req, res) => {
  const { title, author, date, content, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_present: "apadana-group",
      });

      if (uploadRes) {
        const postCollection = new PostCollection({
          title,
          author,
          date,
          content,
          image: uploadRes,
        });

        const savedPostCollection = await postCollection.save();
        res.status(200).send(savedPostCollection);
      } else {
        res.status(400).send("Image upload failed.");
      }
    } else {
      res.status(400).send("Image is required.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while creating the post.");
  }
});



// GET ALL PostCollection
router.get("/", async (req, res) => {
  const qtype = req.query.author;
  try {
    let postCollections;

    if (qtype) {
      postCollections = await PostCollection.find({ author: qtype });
    } else {
      postCollections = await PostCollection.find();
    }

    res.status(200).json(postCollections);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching posts.");
  }
});

// GET POST by ID
router.get("/find/:id", async (req, res) => {
  try {
    const postCollection = await PostCollection.findById(req.params.id);
    res.status(200).send(postCollection);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await PostCollection.findByIdAndDelete(req.params.id);
    res.status(200).send("Post Collection has been deleted..."); 
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE PostCollection
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
        const updatedPostCollection = await PostCollection.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body,
              image: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updatedPostCollection);
      }
    }
  } else {
    try {
      const updatedPostCollection = await PostCollection.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).send(updatedPostCollection);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

module.exports = router;
