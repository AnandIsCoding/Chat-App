import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

export const userSignupController = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Input validation
    if (!name || !email || !password || !bio) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }
    if (name.length < 3 || name.length > 25) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Name should contain minimum 3 and maximum 25 characters",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8 || password.length > 20) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Password should contain minimum 8 and maximum 20 characters",
        });
    }

    if (bio.length < 5 || bio.length > 50) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Bio should contain minimum 5 and maximum 50 characters",
        });
    }

    // Check if user already registered with the same email
    const userRegistered = await userModel.findOne({ email: email });
    if (userRegistered) {
      return res
        .status(403)
        .json({ success: false, message: "Email already Registered" });
    }

    // Hash password
    const encryptedpassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      name: name,
      email: email,
      password: encryptedpassword,
      bio: bio,
    });

    // Generate token
    const token = await jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY, {
      expiresIn: "15d",
    });

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "User Registered successfully",
        token,
        user,
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if the user exists in the database
    const userAvailable = await userModel.findOne({ email:email });
    if (!userAvailable) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    } 
    
    // Verify the password
    const matchPassword = await bcrypt.compare(password, userAvailable.password);
    if (!matchPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = await jwt.sign(
      { _id: userAvailable._id },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "15d",
      }
    );

    // Set cookie and send response
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: `Welcome back, ${userAvailable.name}`,
        user: {
          id: userAvailable._id,
          name: userAvailable.name,
          email: userAvailable.email,
          bio: userAvailable.bio,
        },
      });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const userProfileController = async(req, res) =>{
  try {
    const userid = req.userId
    if(!userid) return res.status(403).json({success:false, message:'Unauthorized access'})
    

      const user = await userModel.findById(userid).select('-password')
      if(!user) return res.status(403).json({success:false,message:'Unauthorized access' })
      return res.status(200).json({success:true, user})
  } catch (error) {
    console.log('error in profule controller = > ', error)
    res.status(500).json({success:false, message:'Internal server error'})
  }
}

export const userLogoutController = async(req,res) =>{
  try {
    return res.status(200).cookie('token', '', {...cookieOptions, maxAge:0}).json({success:true, message:'User Logout Successfully'})
  } catch (error) {
    console.log('error in llogout => ', error)
    return res.status(500).json({success:false, message:'Internal server error'})
  }
}
