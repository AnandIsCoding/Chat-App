import dotenv from 'dotenv'
import connectToDatabase from './configs/database.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import {createServer} from 'http'
import { v4 as uuid } from "uuid";
import {v2 as cloudinary} from 'cloudinary'

import userRouter from './routes/user.routes.js'
import chatRouter from './routes/chat.routes.js'
import messageModel from './models/message.model.js'

import { getSockets } from './utils/helperfunctions.js'
import socketAuthenticator from './middlewares/socketAuthentication.js'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
app.use(cookieParser())
const server = createServer(app)
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:5173', // Allow your frontend's origin
    credentials: true, // Allow cookies and authorization headers
  },
  transports: ["websocket", "polling"], // Allow specific transport methods
  methods:['GET','PUT','POST','DELETE']
})
const userSocketIDs = new Map();


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.use(express.urlencoded({extended:true})) // form data k liye
app.use(express.json()); // json data k liye

//routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/chats', chatRouter)

io.use((socket, next) => {
    cookieParser()(
      socket.request,
      socket.request.res,
      async (err) => await socketAuthenticator(err, socket, next)
    );
  });

io.on('connection',(socket)=>{
    console.log('User connected', socket.id);
    //const user = socket.user;
    const user = socket.user

     userSocketIDs.set(user._id.toString(), socket.id);
   console.log('user socketIds =>> ',userSocketIDs)
    socket.on('NEW_MESSAGE', async ({ chatId, members, message }) => {
        const messageForRealTime = {
          content: message,
          _id: uuid(),
          sender: {
            _id: user._id,
            name: user.name,
          },
          chat: chatId,
          createdAt: new Date().toISOString(),
        };
    
        const messageForDB = {
          content: message,
          sender: user._id,
          chat: chatId,
        };
        console.log('new message ', messageForRealTime)
    
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit('NEW_MESSAGE', {
          chatId,
          message: messageForRealTime,
        });
        io.to(membersSocket).emit('NEW_MESSAGE_ALERT', { chatId });
    
        try {
          await messageModel.create(messageForDB);
        } catch (error) {
          console.log('error in newmessagealert socket part =>> ',error)
        }
      });

      
    socket.on('START_TYPING', ({ members, chatId }) => {
        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(START_TYPING, { chatId });
      });
    
      socket.on('STOP_TYPING', ({ members, chatId }) => {
        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(STOP_TYPING, { chatId });
      });
    
      socket.on('CHAT_JOINED', ({ userId, members }) => {
        onlineUsers.add(userId.toString());
    
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
      });
    
      socket.on('CHAT_LEAVED', ({ userId, members }) => {
        onlineUsers.delete(userId.toString());
    
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
      });
    
      // socket.on("disconnect", () => {
      //   userSocketIDs.delete(user._id.toString());
      //   onlineUsers.delete(user._id.toString());
      //   socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
      // });
})

// Connect to mongoDb and server start
connectToDatabase()
.then(()=>{
    console.log('database connection established')
    server.listen(process.env.SERVER_PORT,()=>{
        console.log(`server is listening at http://localhost:${process.env.SERVER_PORT || 8000}`)
    })
})
.catch((error)=>{
    console.log('Database connection failed')
    console.log('databse connection error : ',error)
})
