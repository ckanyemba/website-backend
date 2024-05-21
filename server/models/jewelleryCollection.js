const mongoose = require("mongoose");

const jewelleryCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

const JewelleryCollection = mongoose.model("JewelleryCollection", jewelleryCollectionSchema);

exports.JewelleryCollection = JewelleryCollection;