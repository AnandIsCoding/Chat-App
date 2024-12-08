import express from 'express'
import { authenticateUser } from '../middlewares/userAuthentication.js'
import { addMembersinGroupController, createnewGroupController, getMyChatsController, getMyGroupsController, removememberfromGroup } from '../controllers/chat.controller.js'
const chatRouter = express.Router()

chatRouter.use(authenticateUser)
chatRouter.post('/createnewgroup', createnewGroupController)
chatRouter.get('/mygroups', getMyGroupsController)
chatRouter.get('/mychats', getMyChatsController)
chatRouter.put('/addmembers', addMembersinGroupController)
chatRouter.delete('/removemember', removememberfromGroup)
export default chatRouter