'use strict';
// require router class
const router = require('express').Router();

// get the current herd for the user
router.get('/modules', token.jwtCheck, (req, res) => {
	res.json({ success: true }) 

});