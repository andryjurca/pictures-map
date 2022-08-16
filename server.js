const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const { Client } = require('pg');
const cloudinary = require('cloudinary')

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

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(`results ${result}`); });