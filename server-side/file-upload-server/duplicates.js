const fs = require('fs');
const config = require('config');
const blockhash = require('blockhash-core');
const { imageFromBuffer, getImageData } = require('@canvas/image');
const imgFolder = config.get('upload_folder_path')
const refMap = new Map();

// Function used to hash
async function hash(imgPath){
    try {
        const data = await readFile(imgPath);
        const hash = await blockhash.bmvbhash(getImageData(data), 8);
        return hexToBin(hash);
    } catch (error){
        console.log(error);
    }
}

// Function to read files
function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) =>{
            if(err) reject(err);
            resolve(imageFromBuffer(data));
        });
    });
}

// Function to change from Hex to Binary
function hexToBin(hexString){
    const hexBinLookup = {
        0: "0000",
        1: "0001",
        2: "0010",
        3: "0011",
        4: "0100",
        5: "0101",
        6: "0110",
        7: "0111",
        8: "1000",
        9: "1001",
        a: "1010",
        b: "1011",
        c: "1100",
        d: "1101",
        e: "1110",
        f: "1111",
        A: "1010",
        B: "1011",
        C: "1100",
        D: "1101",
        E: "1110",
        F: "1111",
    };

    let result = "";
    for(i=0; i<hexString.length; i++){
        result += hexBinLookup[hexString[i]];
    }
    return result;
}

// Function to get names of files
async function getFileNames(){
    return new Promise((resolve, reject) => {
        fs.readdir(imgFolder, (err, files) => {
            if(err) reject(err);
            resolve(files);
        });
    });
}

// Function to generate reference map for duplicates
async function generateRefMap(){
    const files = await getFileNames();
    for(let i=0; i< files.length; i++){
        // hashing the image
        const imgHash = await hash(`${imgFolder}${files[i]}`);
        let valueArray;
        // checking if there is already that hash in the map
        if(refMap.has(imgHash)){
            const existingPaths = refMap.get(imgHash);
            // if there is, it's gonna delete the file
            fs.unlink(`${imgFolder}${files[i]}`, (err) => {
                if(err){
                    console.error(err);
                    return;
                }
            })
            // but nontheless it's going to show it as a duplicate in map
            valueArray = [...existingPaths, `${imgFolder}${files[i]}`];
        } else {
            // going to add new value as it's new hash
            valueArray = [`${imgFolder}${files[i]}`];
        }
        refMap.set(imgHash, valueArray);
    }
    console.log(refMap);
    // clearing the map
    refMap.clear();
}

exports.generateRefMap = generateRefMap;