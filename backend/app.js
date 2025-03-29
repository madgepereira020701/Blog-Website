const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
const connectDB = require('./config/db'); // Database connection


connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

const protect = require("./middlewares/auth_middleware");

const { userregister, login, updatePassword, 
  passwordresetrequest}= require("./controllers/auth_controller");
const posts = require("./controllers/posts_controller");

app.post("/register", userregister);
app.post("/login", login);
app.post("/passwordreset", protect, passwordresetrequest);
app.post("/updatepassword", protect, updatePassword);

app.post("/posts", protect, posts.addpost);
app.get("/posts", protect, posts.getpost);
app.delete("/posts/:title", protect, posts.deletepost);
app.patch("/posts/:title", protect, posts.updatepost);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
