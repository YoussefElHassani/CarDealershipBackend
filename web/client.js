const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

const app = express()
const port = 5000

// Static Files
app.use(express.static('web/public'))

// Templating Engine
app.set('views', './web/src/views')
app.set('view engine', 'ejs')

app.use(fileUpload());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// Routes
const reportsRouter = require('./src/routes/reports')

app.use('/', reportsRouter)
app.use('/report', reportsRouter)

// Listen on port 5000
app.listen(port, () => console.log("Running client on port 5000. Visit: http://localhost:" + port + "/"));