const multer = require('multer');
const { diskStorage } = require('multer');


const storage = diskStorage({
    filename: function (req, file, cb) {
        
        console.log('file===', file);
       
        cb(null, file.originalname); 
    },
});

// Multer configuration to handle multiple fields (image and poster)
const upload = multer({ storage: storage }).fields([
    { name: 'image', maxCount: 1 },  // One image
    { name: 'poster', maxCount: 1 }  // One poster
]);

module.exports = { upload };
