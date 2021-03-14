const e = require('express');
const fs = require('fs');

const imageFilter = (req, file, cb) => {
    // Filtering if the file is under extension of an image
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
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

function duplicateLookUp(jsonObject, comparingObject) {
    let res = jsonObject.filter(it => it.name === comparingObject);
    //console.log(res);
    // console.log(jsonObject);
    // console.log(comparingObject);
    // console.log(res.length);
    if (res.length == 0) { return false; }
    else { return true; }
}

exports.duplicateLookUp = duplicateLookUp;