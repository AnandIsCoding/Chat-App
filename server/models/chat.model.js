import mongoose from 'mongoose'
const chatSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true,
        minlength:[3, 'Name should contain minimum 3 characters'],
        maxlength:[25,'Name cannot contain more than 25 characters']
    },
    groupChat:{
        type:Boolean,
        default:false
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    members:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
    
},{timeStamps:true})

const chatModel = mongoose.model('Chat',chatSchema)

export default chatModel