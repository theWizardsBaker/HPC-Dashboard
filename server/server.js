'use strict';
require('module-alias/register')
const evnFile = process.env.NODE_ENV === 'production' ?  './prd.env' : './dev.env';
// Require classes
const express = require('express');
// require path
const path = require('path');
// use the express engine 
const app = express();
// cross origin requests
const cors = require('cors');
// adding for ability to parse json
const bodyParser = require('body-parser');
// validations
const expressValidator = require('express-validator');
// add mongodb
const mongo = require('mongodb');
// add monk for mongo access
const db = require('monk')('HPCUser:65201@localhost:27017/hpc')
// add logger 
const logger = require('morgan');
// add errorhandler
const errorhandler = require('errorhandler')
// connection port
const port = parseInt(process.env.PORT, 10) || 3000;

// cross origin support
app.use(cors());
// middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({
 customValidators: {
    isArray: function(value) {
        return Array.isArray(value);
    }
 }
}));
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler());
}

// app.use(express.static(path.join(__dirname, 'public')))

// all of our routes for the API will be prefixed with /api
app.use('/api', require('./routes/api'));

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ message: err.message, error: ( (process.env.NODE_ENV !== 'production') ? err : {} ) });
});


app.listen(port);
