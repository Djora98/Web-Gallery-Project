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

// Single picture upload
// app.post('/api/uploads', (req, res) => {
//     let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('picture');

//     upload(req, res, function(err){
//         if(req.fileValidationError){
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file){
//             return res.send('Please select an image to upload');
//         }
//         else if(err instanceof multer.MulterError){
//             return res.send(err);
//         }
//         else if(err){
//             return res.send(err);
//         }

//         res.send({ message: 'Image uploaded successfully!'});
//     });
// });

// Multiple pictures upload
app.post('/api/uploads', (req, res) => {

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
        
        //fs.appendFile('pictures-index.json',)

        let fileNames = req.files.map((file) =>{
            return helpers.newName(file.originalname);
        });

        console.log(fileNames);
        //console.log(req.files.filename);

        // Used to delete duplicates
        setTimeout(duplicates.generateRefMap, 1000);

        // Response to client
        res.send({ message: 'Images uploaded successfully!'});
    });


});

app.get('/api/uploads', (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host') + '/' + config.get('upload_folder_path');
    
    let result = '';
    let nameOfFiles = [];
    let index = -1;
    fs.readdir(`public/${config.get('upload_folder_path')}`, (err, files) =>{
        files.forEach(file =>{
            nameOfFiles[index++] = file.toString();
            console.log(file);
        });
    });
    setTimeout(() => {
        result += baseUrl;
        result += nameOfFiles[index-1];
        console.log(index.toString());
        res.send(result);
        console.log({message: result});
    }, 1000);
    

    
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
