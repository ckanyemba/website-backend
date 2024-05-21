const mongoose = require("mongoose");

const articleCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: Object, required: true },
    file: { type: String, required: true }, // Field for storing the file path or URL
  },
  { timestamps: true }
);

const ArticleCollection = mongoose.model("ArticleCollection", articleCollectionSchema);

exports.ArticleCollection = ArticleCollection;