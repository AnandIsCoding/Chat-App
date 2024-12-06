// Extract file extension from a URL
export const fileFormat = (url) => {
    const fileExtension = url.split('.').pop();
    return fileExtension.toLowerCase(); // Ensures case insensitivity
  };
  
  // Determine the file category based on its extension
  const fileformat = (filetype) => {
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(filetype)) {
      return 'image';
    } else if (['mp4', 'mkv', 'avi', 'mov'].includes(filetype)) {
      return 'video';
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(filetype)) {
      return 'audio';
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(filetype)) {
      return 'document';
    } else {
      return 'anytype';
    }
  };
  
  // Render the file based on its type
  export const displayFile = (url, filetype) => {
    const typeofAttachment = fileformat(filetype);
    switch (typeofAttachment) {
      case 'image':
        return (
          <a href={url} target='_blank' download={true} rel="noopener noreferrer">
          <img
            src={url}
            alt="file"
            className="w-full h-full object-cover rounded-md cursor-pointer"
          />
        </a>
        );
      case 'video':
        return <video src={url} controls width="100%" />;
      case 'audio':
        return <audio src={url} controls />;
      case 'document':
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Download Document
          </a>
        );
      default:
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        );
    }
  };
  
  