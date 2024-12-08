import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[3, 'Name should contain minimum 3 characters'],
        maxlength:[25,'Name cannot contain more than 25 characters']
    },
    email:{
        type:String,
        required:true,
        unique:true,        
    },
    password:{
        type:String,
        minlength:[8, 'Password should contain less than 8 characters'],
        required:true,
        unique:true, 
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    bio:{
        type:String,
        minlength:[5, 'Bio should contain minimum 5 characters'],
        maxlength:[50,'Bio cannot contain more than 50 characters'],
        required:true
    }
},{timestamps:true})

const userModel = mongoose.model('User',userSchema)

export default userModel