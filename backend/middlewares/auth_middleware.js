const jwt = require("jsonwebtoken");
const JWT_KEY = "mysecretkey";

const protect = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split("")[1];
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.sign(token, JWT_KEY);
    req.user = decoded.userId;
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
