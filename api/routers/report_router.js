const reportRouter = require('express').Router();
const reportData = require('../model/report_data');
const index = require('../../src/index');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');

// Configuring multer filename
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './api/uploads/')
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, req.body.file_name + '.' + mime.getExtension(file.mimetype));
      });
    }
  });
const upload = multer({ storage: storage });

var reports = reportData;

// Return reports json
reportRouter.get('/empty', function (req, res) {
    res.json(reports);
});

// return reports after file are uploaded
reportRouter.get('/reports', function (req, res) {
    try{
        var listings_csv = './api/uploads/listings.csv';
        var listings = index.parse_listing_CSV(listings_csv);
        // Reading contacts from a csv file
        var contacts_csv = './api/uploads/contacts.csv';
        var contacts = index.parse_contacts_CSV(contacts_csv);
        // Preprocess the CSV data
        listings = index.preprocess_listings(listings, contacts);
        var listings_datetime = index.preprocess_contact_datetime(contacts);

        reports.req_1.data = index.average_price_seller(listings);
        reports.req_2.data = index.manufacturer_percentage(listings);
        reports.req_3.data = index.average_price(listings);
        reports.req_4.data = index.monthly_contacts(listings, listings_datetime);

        res.json(reports);
    } catch (err) {
        if(err.response) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.requiest) {
            console.log(err.requiest)
        } else {
            console.error('Error', err.message)
        }
    } 
});

// receive listing csv file and saving it in uploads folder
reportRouter.post('/upload-file', upload.single('csvFile'), function (req, res) {
    try{
        let file_name = req.body.file_name + '.csv';
        let path = './api/uploads/' + file_name
        let content = req.body.csvFile;
        fs.writeFile(path, content, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        
            // success case, the file was saved
            console.log(`File ${file_name} was received`);
        });

        res.status(201).send(`File ${file_name}.csv was received`);
    } catch (err) {
        if(err.response) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.requiest) {
            console.log(err.requiest)
        } else {
            console.error('Error', err.message)
        }
    } 
});



// Error handler
reportRouter.use(function (err, req, res, next) {
    if (err) {
        res.status(500).json(err);
    }
});

module.exports = reportRouter;