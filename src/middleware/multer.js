const multer = require('multer');

// Multer Memory Storage (Direct Upload to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({ storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'poster', maxCount: 1 },
    { name: 'profilePic', maxCount: 1 }
]);

module.exports = { upload };
