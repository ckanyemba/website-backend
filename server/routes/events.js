const express = require("express");
const { Event } = require("../models/event");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// CREATE EVENT
router.post("/", isAdmin, async (req, res) => {
  const { name, type, content, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "apadana-group",
      });

      if (uploadRes) {
        const event = new Event({
          name,
          type,
          content,
          desc,
          price,
          image: uploadRes,
        });

        const savedEvent = await event.save();
        res.status(200).send(savedEvent);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ALL EVENTS
router.get("/", async (req, res) => {
  const qtype = req.query.type;
  try {
    let events;

    if (qtype) {
      events = await Event.find({ type: qtype });
    } else {
      events = await Event.find();
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching events.");
  }
});

// GET EVENT

router.get("/find/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error);
  }
});

//DELETE EVENT

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).send("Event has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});

// EDIT EVENT by ID
router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.eventImg) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.event.image.public_id,
    );

    if(destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.eventImg,
        {
          upload_preset: "apadana-group",
        }
      );

      if(uploadedResponse)
      {
        const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ... req.body.event,
              image: uploadedResponse,
           },
          },
          { new: true }
        );

        res.status(200).send(updatedEvent);
      }
    }
  } else {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.event,
        },
        {
          new: true
        }
      );
      res.status(200).send(updatedEvent);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

// UPDATE EVENT

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedEvent);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
