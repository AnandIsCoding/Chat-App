import dotenv from 'dotenv'
import connectToDatabase from './configs/database.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


dotenv.config()
const app = express()


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get('/',(req,res) =>{
    return res.send('chat-app')
})



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
