import express from 'express'
import { authenticateUser } from '../middlewares/userAuthentication.js'
import { addMembersinGroupController, attchmentController, createnewGroupController, deleteChatController, getChatDetailsController, getMessageController, getMyChatsController, getMyGroupsController, leavegroupController, removememberfromGroup, renameGroupController } from '../controllers/chat.controller.js'
import { attachmentsMulter, singleAvatar } from '../configs/multer.js'
const chatRouter = express.Router()

chatRouter.use(authenticateUser)
chatRouter.post('/createnewgroup',singleAvatar, createnewGroupController)
chatRouter.get('/mygroups', getMyGroupsController)
chatRouter.get('/mychats',authenticateUser, getMyChatsController)
chatRouter.put('/addmembers', addMembersinGroupController)
chatRouter.delete('/removemember', removememberfromGroup)
chatRouter.delete('/leave/:id', leavegroupController)
chatRouter.post('/message', attachmentsMulter, attchmentController)
chatRouter.get('/message/:id', getMessageController)
chatRouter
  .route("/:id")
  .get(  getChatDetailsController)
  .put( renameGroupController)
  .delete(deleteChatController);




export default chatRouter