const mongoose = require("mongoose");

const postCollectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    image: { type: Object, required: true }
  },
  { timestamps: true }
);

const PostCollection = mongoose.model("PostCollection", postCollectionSchema);

exports.PostCollection = PostCollection;
