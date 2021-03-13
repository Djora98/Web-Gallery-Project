const fs = require('fs');
const config = require('config');
const blockhash = require('blockhash-core');
const { imageFromBuffer, getImageData } = require('@canvas/image');
const imgFolder = config.get('upload_folder_path')

async function hash(imgPath){
    try {
        const data = await readFile(imgPath);
        const hash = await blockhash.bmvbhash(getImageData(data), 8);
        return hexToBin(hash);
    } catch (error){
        console.log(error);
    }
}

function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) =>{
            if(err) reject(err);
            resolve(imageFromBuffer(data));
        });
    });
}

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

async function getFileNames(){
    return new Promise((resolve, reject) => {
        fs.readdir(imgFolder, (err, files) => {
            if(err) reject(err);
            resolve(files);
        });
    });
}

const refMap = new Map();

async function generateRefMap(){
    const files = await getFileNames();
    for(let i=0; i< files.length; i++){
        const imgHash = await hash(`${imgFolder}${files[i]}`);
        let valueArray;
        if(refMap.has(imgHash)){
            const existingPaths = refMap.get(imgHash);
            fs.unlink(`${imgFolder}${files[i]}`, (err) => {
                if(err){
                    console.error(err);
                    return;
                }
            })
            valueArray = [...existingPaths, `${imgFolder}${files[i]}`];
        } else {
            valueArray = [`${imgFolder}${files[i]}`];
        }
        refMap.set(imgHash, valueArray);
    }
    console.log(refMap);
}

exports.generateRefMap = generateRefMap;