const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Object, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

exports.Event = Event;