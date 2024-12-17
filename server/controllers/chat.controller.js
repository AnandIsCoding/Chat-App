import chatModel from "../models/chat.model.js";
import { emitEvent } from "../utils/helperfunctions.js";
import userModel from '../models/user.model.js';
import messageModel from '../models/message.model.js';
import {uploadFilesToCloudinary, deletFilesFromCloudinary}  from '../utils/helperfunctions.js'

export const createnewGroupController = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !members) {
      return res.status(403).json({
        success: false,
        message: "Group name and members are required",
      });
    }
    //include creator as well in group
    const allmembers = [...members, req.userId];
    if (allmembers.length < 3)
      return res.status(403).json({
        success: false,
        message: "A group must have atleast 3 members",
      });

    const groupChat = await chatModel.create({
      name: name,
      creator: req.userId,
      members: allmembers,
      groupChat: true,
    });
    emitEvent(req, "ALERT", allmembers, `Welcome to ${name} group`);
    emitEvent(req, "REFETCH_CHATS", members);
    return res.json({
      success: true,
      message: "Group created successfully",
      groupChat,
    });
  } catch (error) {
    console.log("Error in creating new group controller =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyGroupsController = async (req, res, next) => {
  try {
    const chats = await chatModel
      .find({
        members: req.userId,
        groupChat: true,
        creator: req.userId,
      })
      .populate("members", "name avatar");

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));

    return res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.log("error in get my groups controller =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyChatsController = async (req, res) => {
  try {
    const chats = await chatModel
      .find({ members: req.userId })
      .populate("members", "name avatar _id");
    
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
      const otherMembers = members.filter(
        (member) => member._id.toString() !== req.userId.toString()
      );

      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar?.url || null)
          : otherMembers[0]?.avatar?.url || null,
        name: groupChat ? name : otherMembers[0]?.name || "Unknown",
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.userId.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      success: true,message:'Chats fetched successfully',
      chats: transformedChats,
    });
  } catch (error) {
    console.log("error in getMyChatsController =>> ", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const addMembersinGroupController = async (req, res) => {
  try {
    //group is slready created eiyh min 3 members, when adding other member it requires chatId and member, only creator of group can add others
    //only 100 members limit
    const { chatId, members } = req.body;
    if(members.length < 1 || !chatId) return res.status(500).json({ success: false, message:'No members added'})
    if(!chatId) return res.status(500).json({succes:false, message:'chat id not provided'})
    const chatfound = await chatModel.findById(chatId);
    if (!chatfound)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    if (!chatfound.groupChat)
      return res
        .status(403)
        .json({ success: false, message: "No group found" });
    if (chatfound.creator.toString() !== req.userId.toString())
      return res
        .status(403)
        .json({ success: false, message: "Only Admin allowed to add members" });

    const allNewMembersPromise = members.map((i) => userModel.findById(i, "name"));

    const allNewMembers = await Promise.all(allNewMembersPromise);

    const uniqueMembers = allNewMembers
      .filter((i) => !chatfound.members.includes(i._id.toString()))
      .map((i) => i._id);

    chatfound.members.push(...uniqueMembers);
    if (chatfound.members.length > 100)
      return res.status(403).json({
        success: false,
        message: "Maximum members (100) limit reached",
      });
    await chatfound.save();
    emitEvent(
      req,
      "ALERT",
      chatfound.members,
      `${allNewMembers} has been added in the group`
    );
    emitEvent(req, "REFETCH_CHATS", chatfound.members);
    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  } catch (error) {
    console.log("Error in add member controller =>> ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};



export const removememberfromGroup = async(req,res) =>{
    try {
        const { removeuserId, chatId } = req.body;
        const chatfound = await chatModel.findById(chatId)
        const userthatwillberemoved = await userModel.findById(removeuserId)

        if(!chatId) return res.status(500).json({succes:false, message:'chat id not provided'})
        if(!userthatwillberemoved) return res.status(404).json({success:false, message:'User not available to be removed'})
        if (!chatfound)
              return res
                .status(404)
                .json({ success: false, message: "Chat not found" });
        if (!chatfound.groupChat)
              return res
                .status(403)
                .json({ success: false, message: "No group found, it's not a group chat" });
        if (chatfound.creator.toString() !== req.userId.toString())
              return res
                .status(403)
                .json({ success: false, message: "Only Admin allowed to add members" });
        if (chatfound.members.length <= 3)
                    return res.status(403).json({
                      success: false,
                      message: "Minimum 3 members are required in group",
                    });

        const allChatMembers = chatfound.members.map((i) => i.toString());

                    chatfound.members = chatfound.members.filter(
                      (member) => member.toString() !== removeuserId.toString()
                    );
                  
                    await chatfound.save();
                  
                    emitEvent(req, "ALERT", chatfound.members, {
                      message: `${userthatwillberemoved.name} has been removed from the group`,
                      chatId,
                    });
                  
                    emitEvent(req, "REFETCH_CHATS", allChatMembers);
                  
                    return res.status(200).json({
                      success: true,
                      message: "Member removed successfully",
                    });
                  

    } catch (error) {
        console.log('Error in removing user =>> ', error)
        return res.status(500).json({success:false, message:'Internal Server Error'})
    }
}


export const leavegroupController = async(req, res) =>{
    try {
      const chatId = req.params.id;
      const chat = await chatModel.findById(chatId);
      console.log(chatId)
      if (!chat) return res.status(404).json({success:false, message:'Chat not found'})
    
      if (!chat.groupChat)
        return res.status(403).json({success:false, message:'This is not a group chat'})
    
      const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.userId.toString()
      );
    
      if (remainingMembers.length < 3)
        return res.status(403).json({success:false, message:'Group must have atleast 3 members'})
    
      if (chat.creator.toString() === req.userId.toString()) {
        const randomElement = Math.floor(Math.random() * remainingMembers.length);
        const newCreator = remainingMembers[randomElement];
        chat.creator = newCreator;
      }
    
      chat.members = remainingMembers;
    
      const [user] = await Promise.all([
        userModel.findById(req.userId, "name"),
        chat.save(),
      ]);
    
      emitEvent(req, ALERT, chat.members, {
        chatId,
        message: `User ${user.name} has left the group`,
      });
    
      return res.status(200).json({
        success: true,
        message: "Leave Group Successfully",
      });
    } catch (error) {
        console.log('Error in leaving group =>> ', error)
        return res.status(500).json({success:false, message:'Internal Server Error'})
    }
}

export const attchmentController = async(req,res) =>{
  try {
    const {chatId} = req.body
    const chat = await chatModel.findById(chatId)
    const user = await userModel.findById(req.userId, "name")
    if(!chat) return res.status(403).json({success:false, message:'Chat not found'})
    const files=req.files || []
    if(files.length < 1) return res.status(403).json({success:false, message:'Please provide attachments'})
 
      const attachments = []
      const messageForDb = {content:"" , attachments, sender:user._id, chat:chatId}
      const messageforRealTime = {
        ...messageForDb,
        sender:{
          _id:user._id,
          name:user.name
        }
      }
    
    const message = await messageModel.create(messageForDb)

      emitEvent(req, 'NEW_ATTACHMENT',chat.members, {
        message:messageforRealTime,
        chatId
      })
      
      
      emitEvent(req, 'NEW_MESSAGE_ALERT',chat.members, {chatId})

      return res.status(200).json({success:false, message:'Attachments sent successfully'})

      

  } catch (error) {
    console.log('error in message controller =>> ', error)
    return res.status(500).json({success:false, message:'Internal server error'})
  }
}


export const getChatDetailsController = (async (req, res) => {
  try {
    if (req.query.populate === "true") {
      const chat = await chatModel.findById(req.params.id)
        .populate("members", "name avatar")
        .lean();
  
      if (!chat) return res.status(404).json({success:false, message:"Chat not found"})
  
      chat.members = chat.members.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
      }));
  
      return res.status(200).json({
        success: true,
        chat,
      });
    } else {
      const chat = await chatModel.findById(req.params.id);
      if (!chat) return res.status(404).json({success:false, message:"Chat not found"})
  
      return res.status(200).json({
        success: true,
        chat,
      });
    }
  } catch (error) {
    console.log('error in get chat details =>> ', error)
    res.status(500).json({success:false, message:'Internal Server Error'})
  }
});


export const renameGroupController = async(req,res) =>{
  try {
    const chatId = req.params.id;
    const { name } = req.body;
    console.log(chatId)
  
    const chat = await chatModel.findById(chatId);
  
    if (!chat) return res.status(404).json({success:false, message:"Chat not found"})
  
    if (!chat.groupChat)
      return res.status(404).json({success:false, message:"Not a Group Chat"})
  
    if (chat.creator.toString() !== req.userId.toString())
      return  res.status(404).json({success:false, message:"Only admin allowedto rename group"})
      
    chat.name = name;
  
    await chat.save();
  
    emitEvent(req, 'REFETCH_CHATS', chat.members);
  
    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
    });
  } catch (error) {
    console.log('error in renaming group =>> ', error)
    res.status(500).json({success:false, message:'Internal Server Error'})
  }
}


export const deleteChatController = async(req,res) =>{
  try {
    const chatId = req.params.id;

  const chat = await chatModel.findById(chatId);

  if (!chat) return res.status(404).json({success:false, message:'No chat found'})
  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.userId.toString())
    return res.status(404).json({success:false, message:'Only admin is allowed to delete'})

  if (!chat.groupChat && !chat.members.includes(req.userId.toString())) {
    return res.status(404).json({success:false, message:'Only admin is allowed to delete'})
  }

  //   Here we have to dete All Messages as well as attachments or files from cloudinary

  const messagesWithAttachments = await messageModel.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAttachments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    deletFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, 'REFETCH_CHATS', members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
  } catch (error) {
    console.log('error in deleting chat =>> ', error)
  }
}



export const getMessageController = async(req,res) =>{
  try {
    const chatId = req.params.id;
  const { page = 1 } = req.query;

  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;

  const chat = await chatModel.findById(chatId);

  if (!chat) return res.status(404).json({success:false, message:'No chat found'})

  if (!chat.members.includes(req.userId.toString()))
    return res.status(404).json({success:false, message:'Only admin is allowed to delete'})

  const [messages, totalMessagesCount] = await Promise.all([
    messageModel.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name")
      .lean(),
    messageModel.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
  } catch (error) {
    console.log('error in get message controller =>> ',error)
    res.status(500).json({success:false, message:'Internal Server Error'})
  }
}