import mongoose from 'mongoose'
const connectToDatabase = async() =>{
    await mongoose.connect(process.env.DATABASE_URI)
}

export default connectToDatabase