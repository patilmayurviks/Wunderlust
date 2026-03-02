const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({

    cloud_name:process.env.CLOUDE_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUDE_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wunderlust_dev',
    allowerdFormat: ['png','jpg','jpeg']// supports promises as well,
    
  },
});

module.exports={cloudinary,storage,};


