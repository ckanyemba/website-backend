const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    link: { type: String, required: true },
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    ebook: { type: Number, require: true},
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;