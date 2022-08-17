const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const { Client } = require('pg');
const { url } = require('inspector');
const cloudinary = require('cloudinary').v2

// express app

const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => console.log('listening...'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())


// 1. read and write files on the filesystem (not used)

app.get('/getu', (req, res) => {
    fs.open('test.txt','r', function(fileNotExists, file) {
        if (fileNotExists) {
            console.log('file does not exist')
            defaultdata = '{"type":"FeatureCollection","features":[]}'
            fs.writeFile('test.txt', defaultdata, (err) => {
                if (err) throw err
            console.log('file exists now')

            fs.readFile('test.txt', (err, data) => {
                if (err) throw err;
                try{
                    return res.json(JSON.parse(data));
                }
                catch(e) {
                    return res.json(data)
                }
                
                })
            })
            
        }
        
        else {
            console.log('file exists')
            fs.readFile('test.txt', (err, data) => {
                if (err) throw err;
                try{
                    return res.json(JSON.parse(data));
                }
                catch(e) {
                    return res.json(data)
                }
                
            })
        }
    })
})

app.post('/postu', (req, res) => {
    const text1 = req.body.text
    console.log(text1)
    fs.writeFile('test.txt', text1, (err) => {
        if (err) throw err
    })
})


// 2. upload images to the server's filesystem

const imgFolder = './public/img';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imgFolder)
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage:storage })

app.post('/upload', upload.single('image'), (req, res) => {
    
    res.redirect('/upload.html')

})

app.get('/filenamelist', (req, res) => {
    filenameList = []
    fs.readdirSync(imgFolder).forEach(file => {
        console.log(file);
        filenameList.push(file)
      });
      res.json(filenameList)
})


// 3. database postgres connection

process.env.NODE_ENV != 'production' ? require('dotenv').config() : null;
const localdblink = process.env.LOCAL_DATABASE_URL
const productiondbLink = process.env.DATABASE_URL    

const client = new Client({
    connectionString: productiondbLink || localdblink,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

client.connect();

app.get('/getfromdb', async(req, res) => {
    let response = await client.query("SELECT jsondata FROM maps WHERE id=1;");
    realResponse = response.rows[0].jsondata
    return res.status(200).send(realResponse)
}) 

app.post('/posttodb', async (req, res) => {
    let text1 = req.body.text
    text1 = `'${text1}'`
    console.log(`the posted geojson data looks like this: ${text1}`)
    queryContent = `UPDATE maps SET jsondata = ${text1} WHERE id=1;`
    console.log(`query content is:\n ${queryContent}`)
    await client.query(queryContent)
    
})

// cloudinary store images in cloud

const cloud_name = process.env.CLOUD_NAME 
const api_key = process.env.API_KEY
const api_secret = process.env.API_SECRET

cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret, 
    secure: true,
});

cloudinary.api.resources({type:"upload",prefix:"map-pictures/"}, function(error, result){
    console.log(error, result)
    //console.log(typeof(result.resources.length))
    urlList = []
    result.resources.forEach(image => {
        const url = JSON.stringify(image.secure_url)
        const relativeUrl = url.split("/map-pictures/")[1].slice(0, -1)
        console.log(relativeUrl)
        urlList.push(relativeUrl)
        
    })
})

app.get('/cloudimagelist', (req, res) => {
    console.log(urlList)
    console.log('am actualizat porc gras')
    res.json(urlList)
})

function add(path) {
    cloudinary.uploader.upload(path, {upload_preset: "test-preset", use_filename: true, unique_filename: false, folder: 'map-pictures'}, (error, result)=>{
        console.log(result, error || 'You succesfully uploaded the image to cloudinary!');
        imageURL = result.secure_url
        console.log(imageURL)
        imagesUrlList.push(imageURL)
        console.log(`the current url list: ${imagesUrlList}`)
    }
)}

function del(id) {
    cloudinary.uploader.destroy(id, function(result) { console.log(result) });
}

//add("./public/img/crimsonu.jpg")
// del('cld-sample')


