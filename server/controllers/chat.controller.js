import chatModel from "../models/chat.model.js";
import { emitEvent } from "../utils/helperfunctions.js";
import userModel from '../models/user.model.js';

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
      .populate("members", "name avatar");
    const otherMembers = chats.map((chat) =>
      chat.members.filter(
        (member) => member._id.toString() !== req.userId.toString()
      )
    );
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMembers.avatar.url],
        name: groupChat ? name : otherMembers.name,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.userId.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });
    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    console.log("error in getmychatscontroller =>> ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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


export const leavegroup = async(req, res) =>{
    try {
        
    } catch (error) {
        console.log('Error in leaving group =>> ', error)
        return res.status(500).json({success:false, message:'Internal Server Error'})
    }
}