import mongoose from 'mongoose'
const conversationSchema = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }
    ]
},{timeStamps:true})

const conversationModel = mongoose.model('Conversation',conversationSchema)

export default conversationModel