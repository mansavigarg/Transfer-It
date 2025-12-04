const mongoose = require("mongoose");
require("dotenv").config(); // ensure .env is loaded

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("❌ MONGO_URI not found in environment variables!");
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
})

const accountSchema = new mongoose.Schema({
    userID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance : {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User" , userSchema);
const Account = mongoose.model("Account" , accountSchema)

module.exports = {
    connectDB,
    User,
    Account
};  
