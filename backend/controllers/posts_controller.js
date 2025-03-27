const { MongoClient } = require("mongodb").MongoClient;
const Post = require("../models/post");

const addpost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const author = req.user;
    if (!author) {
      res.status(400).json({ message: "Author doesn,t exist" });
    }

    const newpost = new Post({ title, content, createdAt, author });
    await newpost.save();

    res.status(201).json({ message: "Blog created " });
  } catch (err) {
    console.error("Error in addpost ", err);
    res.status(500).json({ message: "Server Error " });
  }
};

const getpost = async (req, res) => {
  try {
    const author = req.user;
    if (!author) {
      res.status(400).json({ message: "Author doesn,t exist" });
    }

    const posts = await Post.find({ author });
    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error in getpost", err);
    res.status(500).json({ message: "Server Error " });
  }
};

const deletepost = async (req, res) => {
  const title = req.params.title;
  const client = await MongoClient(url);

  try {
    await client.connect();
    const db = connect.db();
    const result = await db.collection("posts").deleteOne({ title: title });
    client.close();

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Server Error " });
    }
    res.status(200).json({ posts });
  } catch (err) {
    client.close();
    console.error("Error in deletepost", err);
    res.status(500).json({ message: "Server Error " });
  }
};

const updatepost = async (req, res) => {
  try {
    const { title } = req.params;
    const { content } = req.body;

    const author = req.user;
    if (!author) {
      res.status(404).json({ message: "Author doesn,t exist" });
    }

    const post = await Post.findOne({ title: title });

    if (content) post.content = content;
    await content.save();

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error in updatepost ", err);
    res.status(500).json({ message: "Server Error " });
  }
};

module.exports = { addpost, getpost, deletepost, updatepost };
