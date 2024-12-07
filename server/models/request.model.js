import mongoose from 'mongoose'
const requestSchema = mongoose.Schema({
    status:{
        type:String,
        default:'pending',
        enum:['pending','accepted','rejected']
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

const requestModel = mongoose.model('Request',requestSchema)
export default requestModel