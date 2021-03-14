const imageFilter = (req, file, cb) => {
    // Filtering if the file is under extension of an image
    if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)){
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

exports.imageFilter = imageFilter;

function newName(name) {
    return name.replace(/\s/g, '-').toLocaleLowerCase();
}

exports.newName = newName;