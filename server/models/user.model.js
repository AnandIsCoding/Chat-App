import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true,
        minlength:[3, 'Name should contain minimum 3 characters'],
        maxlength:[25,'Name cannot contain maximum 25 characters']
    },
    email:{
        type:String,
        required:true,
        unique:true,        
    },
    password:{
        type:String,
        minlength:[8, 'Password should contain minimum 8 characters'],
        maxlength:[20,'Password cannot contain maximum 20 characters'],
        required:true,
        unique:true, 
    },
    profilePic:{
        type:String,
        default: ''
    }
},{timeStamps:true})

const userModel = mongoose.model('User',userSchema)

export default userModel