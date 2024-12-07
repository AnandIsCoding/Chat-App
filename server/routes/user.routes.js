import express from 'express'
import {userLoginController, userLogoutController, userProfileController, userSignupController} from '../controllers/user.controller.js'
import { authenticateUser } from '../middlewares/userAuthentication.js'

const userRouter = express.Router()

userRouter.post('/signup', userSignupController)
userRouter.post('/login', userLoginController)
userRouter.use(authenticateUser)
userRouter.get('/profile', userProfileController)
userRouter.delete('/logout', userLogoutController)

export default userRouter