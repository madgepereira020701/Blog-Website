const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⬇️ New field to track modification history
    modificationHistory: [
      {
        modifiedAt: { type: Date, default: Date.now },
        updatedFields: [String], // optional: fields that changed
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastModifiedDate" },
  }
);

module.exports = mongoose.model("posts", postSchema);
