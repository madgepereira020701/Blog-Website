const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");

connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "10mb" }));

// ✅ Serve Static Files for Image Access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const protect = require("./middlewares/auth_middleware");
const protect1 = require("./middlewares/post_middleware");

const {
  userregister,
  userlogin,
  updatePassword,
  passwordresetrequest,
} = require("./controllers/auth_controller");
const posts = require("./controllers/posts_controller");

// ✅ Image Upload Configuration (for /upload route)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Image Upload Route
app.post("/upload", protect1, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
});

// ✅ Routes
app.post("/register", userregister);
app.post("/login", userlogin);
app.post("/passwordreset", protect, passwordresetrequest);
app.post("/updatepassword", protect, updatePassword);

app.post("/posts", protect1, posts.addpost);
app.get("/posts", protect1, posts.getpost);
app.delete("/posts/:title", protect1, posts.deletepost);
app.patch("/posts/:_id", protect1, posts.updatepost);
app.get("/post/:title", protect1, posts.postdetails);
app.get("/posts/:id/history", protect1, posts.gethistory);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
