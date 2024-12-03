import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl:{
        type: String,
        default: ""
    },
    videoUrl:{
        type: String,
        default: ""
    },
    seen:{
        type: Boolean,
        default: false
    }
  },
  { timeStamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
