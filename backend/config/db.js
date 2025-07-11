const mongoose = require("mongoose");

mongoose.connection.on("error", (err) => {
  console.log("Mongoose not found");
});

const mongoURI =
  "mongodb+srv://<db.username>:<db.password>@blogs.5ed1t.mongodb.net/?retryWrites=true&w=majority&appName=blogs";
//add your own password and username you generated in Mongodb. 
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      connectTimeoutMS: 30000,
    });
    console.log("Connecting to MongoDb");
  } catch (err) {
    console.error("hhh", err);
    process.exit(1);
  }
};

module.exports = connectDB;
