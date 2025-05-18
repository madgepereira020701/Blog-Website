const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");

// Storage config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image");

// ✅ Add Post
const addpost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const author = req.user;

    // Validate required fields
    if (!author) {
      return res.status(401).json({ message: "Invalid or missing token. Author not found." });
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    let imageUrl = "";

    if (image) {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: "Invalid base64 image format." });
      }

      const extension = matches[1];
      const base64Data = matches[2];
      const filename = `${Date.now()}.${extension}`;
      const filePath = path.join(__dirname, "..", "uploads", filename);

      try {
        fs.writeFileSync(filePath, base64Data, "base64");
        imageUrl = `http://localhost:3000/uploads/${filename}`;
      } catch (fileErr) {
        console.error("Error writing image to disk:", fileErr);
        return res.status(500).json({ message: "Failed to save image file." });
      }
    }

    const newPost = new Post({
      title,
      content,
      image: imageUrl,
      author // Ensure it's just the ID
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post added successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error in addpost:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




// ✅ Get Posts (by author)
// ✅ Get Posts (by author)
const getpost = async (req, res) => {
  try {
    const author = req.user;

    if (!author) {
      return res.status(400).json({ message: "Author doesn't exist or invalid token" });
    }

    const posts = await Post.find({ author: author });

    // Check if posts were found
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    // Send posts with full details (title, content, image)
    return res.status(200).json({ data: posts });
  } catch (error) {
    console.error("Error in getpost:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const postdetails = async (req, res) => {
  const { title } = req.params;

  try {
    // Find the member based on memno in the "members" collection
    const post = await Post.findOne({ title });

    if (!post) {
      return res.status(404).json({ status: 'ERROR', message: 'Member not found' });
    }

    // Send the JSON response
    res.status(200).json({
      status: 'SUCCESS',
      data: post,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ status: 'ERROR', message: 'Error fetching payment details' });
  }
};


// ✅ Delete Post
const deletepost = async (req, res) => {
  try {
    const { title } = req.params;

    const deletedPost = await Post.findOneAndDelete({ title });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete image
    if (deletedPost.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        deletedPost.image.replace("http://localhost:3000/", "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletepost:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Post
const updatepost = async (req, res) => {
  try {
    const postId = req.params._id;
    const { content, image, title } = req.body;
    const author = req.user;

    if (!author) {
      return res.status(400).json({ message: "Author doesn't exist" });
    }

    const updatedData = { content, title, image };

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author },
      updatedData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post updated successfully", data: updatedPost });
  } catch (error) {
    console.error("Error in updatepost:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { addpost, getpost, deletepost, updatepost, postdetails };
