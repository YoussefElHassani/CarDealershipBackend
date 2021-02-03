const express = require('express');
const reportsRouter = express.Router();
const axios = require('axios');
const request = require('request');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
var FormData = require('form-data');


reportsRouter.get('/', async(req, res) => {
    try {
        res.render('listing', {})
    } catch (err) {
        if(err.response) {
            res.render('listing')
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.requiest) {
            res.render('listing')
            console.log(err.requiest)
        } else {
            res.render('listing')
            console.error('Error', err.message)
        }
    } 
});

reportsRouter.get('/process', async(req, res) => {
    try {
        res.render('contact', {})
    } catch (err) {
        if(err.response) {
            res.render('contact')
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.requiest) {
            res.render('contact')
            console.log(err.requiest)
        } else {
            res.render('contact')
            console.error('Error', err.message)
        }
    } 
});

reportsRouter.get('/reports', async(req, res) => {
    try {
        const reportsAPI = await axios.get(`http://localhost:3000/api/reports`)
        reports = reportsAPI.data
        reports_array = []
        for (const [key, value] of Object.entries(reports)) {
            reports_array.push(value)
        }
        res.render('reports', { reports : reports_array})
    } catch (err) {
        if(err.response) {
            res.render('reports', { articles : null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.requiest) {
            res.render('reports', { articles : null })
            console.log(err.requiest)
        } else {
            res.render('reports', { articles : null })
            console.error('Error', err.message)
        }
    } 
});

reportsRouter.post('/upload_listing', async (req, res, next) => {
    try{
        const url = 'http://localhost:3000/api/upload-file/'
        let file = JSON.parse(JSON.stringify(Object.values(req.files)[0]));
        
        axios({
            method: 'post',
            url: url,
            data: {
            file_name: 'listings',
            csvFile: Buffer.from(file.data.data).toString()
            }
        }).then(response =>
            this.info = response
            );
        res.redirect("http://localhost:5000/process/")
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
})

reportsRouter.post('/upload_contact', async (req, res, next) => {
    try{
        const url = 'http://localhost:3000/api/upload-file/'
        let file = JSON.parse(JSON.stringify(Object.values(req.files)[0]));
        
        axios({
            method: 'post',
            url: url,
            data: {
            file_name: 'contacts',
            csvFile: Buffer.from(file.data.data).toString()
            }
        }).then(response =>
            this.info = response
            );
        res.redirect("http://localhost:5000/reports/")
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
})



module.exports = reportsRouter;
