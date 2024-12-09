export const emitEvent = (req, event, users, data) =>{
    console.log('Emiting event : ', event)
}

export const uploadFilesToCloudinary  = () =>{
    console.log('cloudinary')
}



export const deletFilesFromCloudinary = async () => {
    // Delete files from cloudinary 
  };



  export const getSockets = (users = []) => {
    const sockets = users.map((user) => userSocketIDs.get(user.toString()));
  
    return sockets;
  };