const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "mysecretkey";

const Admin = require("../models/auth");

const userregister = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Admin already exists" });
    }

    const newAdmin = new Admin({ username, password, email });
    await newAdmin.save();

    return res
      .status(201)
      .json({ isSuccess: true, message: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Admin already exists" });
  }
};

const userlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid credentials" });
    }

    console.log("Received login body:", req.body);

    const isValidPassword = await admin.isValidPassword(password);
    console.log("Password valid:", isValidPassword); // NEW

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { author: admin._id, userName: admin.username },
      JWT_SECRET,
      { expiresIn: "1hr" }
    );
    return res.status(200).json({ isSuccess: true, data: {userName: admin.username, token} });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "An error occured" });
  }
};

const updatePassword = async (req, res) => {
  const { token } = req.params;
  const { newpassword, confirmPassword } = req.body;

  try {
    if (!newpassword || !confirmPassword) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "All fields are required" });
    }

    if (newpassword !== confirmPassword) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Passwords do not match" });
    }

    const foundUser = await Admin.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid or expired token" });
    }

    const isMatch = await bcrypt.compare(
      newpassword.trim(),
      foundUser.password
    );
    if (isMatch) {
      return res.status(400).json({
        isSuccess: false,
        message: "New password cannot be the same as old password",
      });
    }

    foundUser.password = newpassword.trim();
    foundUser.passwordResetToken = undefined;
    foundUser.passwordResetExpires = undefined;
    await foundUser.save();

    return res
      .status(200)
      .json({ isSuccess: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "An error occured" });
  }
};

function generatePasswordResetToken() {
  const token = jwt.sign({ purpose: "passwordReset" }, JWT_SECRET, {
    expiresIn: "1hr",
  });
  return token;
}

async function storeToken(email, token) {
  try {
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "User not found" });
    }
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();

    return res
      .status(200)
      .json({ isSuccess: true, message: "Token stored successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "An error occured" });
  }
}

const passwordresetrequest = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Admin not found" });
    }
    const token = generatePasswordResetToken();

    try {
      await sendPasswordResetEmail(email, token);
      return res.status(200).json({
        isSuccess: true,
        message: "Password reset email sent successfully",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ isSuccess: false, message: "An error occured" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, message: "An error occured" });
  }
};

const nodemailer = require("nodemailer");
async function sendPasswordResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'madgepereira020701@gmail.com',
      pass: 'xezg tgdr tods jpbc', // Use an app-specific password for Gmail
      },
  });

  const resetLink = `http://localhost:3001/changepassword?token=${token}`;

  const mailOptions = {
    from: "madgepereira020701@gmail.com",
    to: email,
    subject: "jhhh",
    html: `
             <p> 
             < a href="${resetLink}" >Reset Password</a> 
             </p>
            `,
  };

  await transporter.sendMail(mailOptions);
  await storeToken(email, token);
}

module.exports = { userregister, userlogin, updatePassword, passwordresetrequest };
