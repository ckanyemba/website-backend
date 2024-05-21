const mongoose = require("mongoose");

const shoeCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

const ShoeCollection = mongoose.model("ShoeCollection", shoeCollectionSchema);

exports.ShoeCollection = ShoeCollection;