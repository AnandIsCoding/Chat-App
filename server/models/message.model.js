import mongoose from 'mongoose'
const messageSchema = mongoose.Schema({
    content:String,
    atttachments:[
        {
            public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
        }
    ],
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true
    }
},{timestamps:true})

const messageModel = mongoose.model('Message', messageSchema)
export default messageModel