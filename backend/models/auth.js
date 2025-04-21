const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;  // At least one special character


const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (!passwordRegex.test(this.password)) {
    const error = new Error("Pssword ");
    return next(error);
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    next(err);
  }
});

adminSchema.methods.isValidPassword = async function (password) {
  const trimmedPassword = password.trim();
  return await bcrypt.compare(trimmedPassword, this.password);
};

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
