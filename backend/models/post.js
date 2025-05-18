// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   image: {type: String, default: ""},
//   author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("posts", postSchema);


const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedDate' }
  }
);

module.exports = mongoose.model("posts", postSchema);
