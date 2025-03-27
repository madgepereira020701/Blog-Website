const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
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
    console.log("Error hashing password:", err);
    next(err);
  }
});

adminSchema.methods.isValidPassword = async function (password) {
  const trimmedPassword = password.trim();
  return await bcrypt.compare(trimmedPassword, this.password);
};

module.exports = mongoose.model("admin", adminSchema);
