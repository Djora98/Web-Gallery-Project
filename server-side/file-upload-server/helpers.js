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

function newFileIndexing(indexing, files, baseUrl) {
    // Checking every uploaded file for their name and looking in picutres-index.json if there is same
    files.forEach(file => {
        if (duplicateLookUp(indexing, file.toString())) {
            // If there is nothing will be done
            console.log(file.toString());
        } else {
            // If there isn't new object will be added to an existing array of json objects
            console.log("nije pronadjen");
            // Defining new json object
            let jsonText = {
                url: baseUrl + file.toString(),
                name: file.toString()
            };
            // Adding new json object in index
            indexing[indexing.length] = jsonText;

            // Writing new index again
            fs.writeFile('pictures-index.json', JSON.stringify(indexing), (err) => {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    });
}

exports.newFileIndexing = newFileIndexing;