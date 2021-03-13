const config = require('config');
const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');
const dupli = require('./duplicates');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, config.get('upload_folder_path'));
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

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

app.post('/api/uploads', (req, res) => {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('pictures', 10);

    upload(req, res, function(err){
        if(req.fileValidationError){
            return res.send(req.fileValidationError);
        }
        else if (!req.files){
            return res.send('Please select an image to upload');
        }
        else if(err instanceof multer.MulterError){
            return res.send(err);
        }
        else if(err){
            return res.send(err);
        }

        res.send({ message: 'Images uploaded successfully!'});
    });

    setTimeout(dupli.generateRefMap, 5000);
});

app.get('/api/uploads', (req, res) => {

});

app.listen(port, () => console.log(`App listening on port ${port}...`));
