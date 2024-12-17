import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
const socketAuthenticator = async (err, socket, next) => {
    try {
      if (err) return next(err);
  
      // Extract token from cookies
      const authToken = socket.request.cookies?.token;
  
      if (!authToken) {
        return next(new Error('Please login to access this route'));
      }
  
      // Verify token
      const decodedData = jwt.verify(authToken, process.env.PRIVATE_KEY);
  
      // Fetch user
      const user = await userModel.findById(decodedData._id);
      if (!user) {
        return next(new Error('Please login to access this route'));
      }
  
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      next(new Error('Authentication failed'));
    }
  };
  

  export default socketAuthenticator