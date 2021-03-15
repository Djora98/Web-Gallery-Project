const config = require('config');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');
const duplicates = require('./duplicates');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let indexing = require('./pictures-index.json');
let files = [];

// Storage for images
const storage = multer.diskStorage({

    // Destination of uploaded images
    destination: (req, file, cb) => {
        cb(null, `public/${config.get('upload_folder_path')}`);
    },

    // Naming uploaded images
    filename: (req, file, cb) => {
        // let newName = file.originalname.replace(/\s/g, '-');
        cb(null, helpers.newName(file.originalname));
    }
});

// Multiple-Single picture upload
app.post('/api/uploads', (req, res) => {

    const baseUrl = req.protocol + '://' + req.get('host') + '/' + config.get('upload_folder_path');

    // Upload of images
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('pictures', 10);

    upload(req, res, function (err) {
        // Is there file validation error
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        // Are there files
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }
        // Is there error concerning Multer
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        // Any other error
        else if (err) {
            return res.send(err);
        }

        

        // Used to delete duplicates and index
        setTimeout(async function() { 
            await duplicates.generateRefMap().then(value => {files = value;});
            console.log(files);
            helpers.newFileIndexing(indexing, files, baseUrl);
        }, 2000);

        // Response to client
        res.send({ message: 'Images uploaded successfully!' });
    });


});

// Getting picture with defined name
app.get('/api/uploads/:name', (req, res) => {

    // Looking through index for picture with defined name
    const picture = indexing.find(p => p.name === helpers.newName(req.params.name).toString());

    // If there is none, will get error 404
    if (!picture) return res.status(404).send('The picture with the given name was not found.');
    console.log(picture);

    // Redirects to picture
    res.redirect(picture.url);


});

// Getting list of all pictures
app.get('/api/uploads', (req, res) => {
    // Sending over the indexing json file
    res.send(JSON.stringify(indexing));
});

console.log(JSON.stringify(indexing));
app.listen(port, () => console.log(`App listening on port ${port}...`));
