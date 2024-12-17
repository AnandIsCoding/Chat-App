import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

import chatModel from "../models/chat.model.js";
import requestModel from "../models/request.model.js";
import {
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/helperfunctions.js";

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
      return res.status(403).json({
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
      return res.status(403).json({
        success: false,
        message: "Password should contain minimum 8 and maximum 20 characters",
      });
    }

    if (bio.length < 5 || bio.length > 50) {
      return res.status(403).json({
        success: false,
        message: "Bio should contain minimum 5 and maximum 50 characters",
      });
    }

    const file = req.file;
    if (!file) {
      return res
        .status(403)
        .json({ success: false, message: "User profile image is required" });
    }

    // Upload image to Cloudinary
    const result = await uploadFilesToCloudinary([file]);

    if (!result || !result[0]) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    // Check if user already registered with the same email
    const userRegistered = await userModel.findOne({ email: email });
    if (userRegistered) {
      return res
        .status(403)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      name,
      email,
      password: encryptedPassword,
      bio,
      avatar, // Avatar field with public_id and url
    });

    // Generate token
    const token = await jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY, {
      expiresIn: "15d",
    });

    return res.status(201).cookie("token", token, cookieOptions).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
    const userAvailable = await userModel.findOne({ email: email });
    if (!userAvailable) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Verify the password
    const matchPassword = await bcrypt.compare(
      password,
      userAvailable.password
    );
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
        token: token,
        user: userAvailable,
      });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const userProfileController = async (req, res) => {
  try {
    const userid = req.userId;
    if (!userid)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });

    const user = await userModel.findById(userid).select("-password");
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in profile controller = > ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const userLogoutController = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { ...cookieOptions, maxAge: 0 })
      .json({ success: true, message: "User Logout Successfully" });
  } catch (error) {
    console.log("error in llogout => ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const searchController = async (req, res) => {
  try {
    const { prompt = "" } = req.query;

    // Finding all my chats
    const myChats = await chatModel.find({
      groupChat: false,
      members: req.userId,
    });

    // Extracting all users from my chats (means friends or people I have chatted with)
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    // Ensure to exclude duplicates and add the current user ID to the exclusion list
    const exclusionList = [...new Set([...allUsersFromMyChats, req.userId])];

    // Finding all users except me and my friends
    const allUsersExceptMeAndFriends = await userModel.find({
      _id: { $nin: exclusionList }, // Exclude friends and current user
      name: { $regex: prompt, $options: "i" }, // Match names based on the prompt
    });

    // Modifying the response
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error in search controller =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    const request = await requestModel.findOne({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    });

    if (request)
      return res
        .status(403)
        .json({ success: false, message: "Request already sent" });
    await requestModel.create({
      sender: req.userId,
      receiver: userId,
    });

    emitEvent(req, "NEW_REQUEST", [userId]);

    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  } catch (error) {
    console.log("Error in send friend request =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId, accept } = req.body;

    const request = await requestModel
      .findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (request.receiver._id.toString() !== req.userId.toString())
      return res
        .status(404)
        .json({ success: false, message: "Not authorized to accept" });

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend Request Rejected",
      });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      chatModel.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, "REFETCH_CHATS", members);

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    console.log("Error in accept friend request =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllnotifications = async (req, res) => {
  try {
    const requests = await requestModel
      .find({ receiver: req.userId })
      .populate("sender", "_id name avatar ");

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      allRequests,
    });
  } catch (error) {
    console.log("Error in get notification controller =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

export const getMyFriends = async (req, res) => {
  try {
    const chatId = req.query.chatId;

    const chats = await chatModel
      .find({
        members: req.userId,
        groupChat: false,
      })
      .populate("members", "name avatar _id");

    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.userId);

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    if (chatId) {
      const chat = await chatModel.findById(chatId);

      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );

      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Friends fetched successfully",
        friends,
      });
    }
  } catch (error) {
    console.log("Error in get notification controller =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
