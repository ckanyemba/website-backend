const mongoose = require("mongoose");

const thriftCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

const ThriftCollection = mongoose.model("ThriftCollection", thriftCollectionSchema);

exports.ThriftCollection = ThriftCollection;