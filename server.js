const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');

const app = express()

app.listen(3000, () => console.log('listening...'))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
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