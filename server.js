// Get dependencies
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const port = process.env.PORT || '3000';

// import the routing file to handle the default (index) route
const solveRoutes = require('./server/routes/solves')

mongoose.connect('mongodb+srv://nodejs-access:gNiJjNn5Uxwm8H1j@wdd430-final-project.s5udc.mongodb.net/final-project', { useNewUrlParser: true }, (err, res) => {
    if (err) console.log('Connection failed: ' + err)
    else console.log('Connected to database!')
})

const expressApp = express(); // create an instance of express

// Tell express to use the following parsers for POST data
expressApp
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(logger('dev'))
    .use(cors())
    // .use(express.static(path.join(__dirname, 'dist/wdd430-final-project')))
    .use('/solves', solveRoutes)
    .use((req, res) => {
        res.status(404).json('That route isn\'t set, please check the route and try again')
    })
    .set('port', port);

// Create HTTP server.
const server = http.createServer(expressApp);

server.listen(port, function () {
    console.log('API running on localhost: ' + port)
});
