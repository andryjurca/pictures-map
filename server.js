const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const { Client } = require('pg');


const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => console.log('listening...'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())

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

let client;

// acum fac rehetul
if (process.NODE_ENV != 'production') {
    require('dotenv').config()
    console.log('the app is running locally.')
    localdbLink = 'postgres://postgres:andrei11@localhost:5432/app'
    console.log(localdbLink)
    client = new Client({
        connectionString: localdbLink,
        ssl: false,
    });
    client.connect();

}
else {
    console.log('the app is running in production')
    productiondbLink = process.env.DATABASE_URL    
    console.log(productiondbLink)
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect();

}

app.get('/getfromdb', async(req, res) => {
    let response = await client.query("SELECT jsondata FROM maps WHERE id=1;");
    realResponse = response.rows[0].jsondata
    //res.status(200).send(realResponse)
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