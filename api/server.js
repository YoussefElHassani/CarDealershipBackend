const express = require('express');
const bodyParser = require('body-parser');
const reportRouter = require('./routers/report_router');

var app = express();
var port = 3000;

app.use(express.static('client'));


// Enable CORS on ExpressJS to avoid cross-origin errors when calling this server using AJAX
// We are authorizing all domains to be able to manage information via AJAX (this is just for development)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,recording-session");
    next();
});

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));


app.use('/api', reportRouter);
app.listen(port);
console.log("Running server on port 3000. the api is accessible via: http://localhost:" + port + "/");