import dotenv from 'dotenv'
import connectToDatabase from './configs/database.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRouter from './routes/user.routes.js'

dotenv.config()
const app = express()


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended:true})) // form data k liye
app.use(express.json()); // json data k liye

//routes
app.use('/api/v1/users', userRouter)


// Connect to mongoDb and server start
connectToDatabase()
.then(()=>{
    console.log('database connection established')
    app.listen(process.env.SERVER_PORT,()=>{
        console.log(`server is listening at http://localhost:${process.env.SERVER_PORT || 8000}`)
    })
})
.catch((error)=>{
    console.log('Database connection failed')
    console.log('databse connection error : ',error)
})
