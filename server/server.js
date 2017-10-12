'use strict';
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
// connection port
const port = parseInt(process.env.PORT, 10) || 3000;

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
app.use(cors());
// dev logging

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler());
}


// app.use(express.static(path.join(__dirname, 'public')))


// require the contact us route
// app.use('/sendmail', require('./routes/contact'))
// all of our routes for the API will be prefixed with /api
// app.use('/api', require('./routes/api'));

// send a nicely formatted error when the user's not authorized
app.use(function (err, req, res, next) {

  if (err.name === 'StatusError') {
    res.status(err.status).json(err);
    return;
  }
  // notify the user the token has expired
  if (err.name === 'UnauthorizedError') {
    // return a custom error message for unauthorized requests
    err.authorized = false;
  	res.status(err.status).json(err);
  	return;
  }
  // carry on
  // next(err);
  res.json(err)
});

app.listen(port);
