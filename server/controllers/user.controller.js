import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const userSignupController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //check if user already registered
    const userAlreadyregistered = await userModel.findOne({ email: email });
    if (userAlreadyregistered)
      return res
        .status(403)
        .json({ success: false, message: "User already registered" });

    //hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // Log first name and last name for debugging
    console.log(`Creating user: ${userName}}`);
    // create user save entry in db
    await userModel.create({
      userName,
      email,
      password: encryptedPassword,
    });

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully" , });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
    console.log("Error is signup " + error);
  }
};
