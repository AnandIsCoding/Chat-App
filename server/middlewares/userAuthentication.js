import jwt from 'jsonwebtoken'
export const authenticateUser = (req,res,next) =>{
    try {
        const {token} = req.cookies
        if(!token) return res.status(403).json({success:false, message:'Unauthorized access'})

            const decodedData = jwt.verify(token, process.env.PRIVATE_KEY);

            req.userId = decodedData._id;
          
            return next();
    } catch (error) {
        console.log('Error in authenticate user middleware = > ', error)
        return res.status(500).json({success:false, message:'Internal server error'})       
    }
}