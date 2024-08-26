import imageCompression from "browser-image-compression";

const resizeImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 1, 
      maxWidthOrHeight: 256, 
    };

    const compressedFile = await imageCompression(file, options);
    return blobToFile(compressedFile)
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
};

const blobToFile = (blob) => {
    const options = {
      type: blob.type,
    }

    return new File([blob], blob.name, options)
  }

export default resizeImage