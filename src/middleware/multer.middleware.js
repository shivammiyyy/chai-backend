import multer from "multer";



// Set up storage destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/temp'); // specify the destination folder
  },
  filename: function (req, file, cb) {
      cb(null,  file.originalname); // specify the filename
  }
});

// Initialize upload variable
export const upload = multer({ storage: storage })
