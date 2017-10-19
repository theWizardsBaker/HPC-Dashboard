'use strict';
// require router class
const router = require('express').Router();

// // get the current herd for the user
router.get('/all', (req, res) => {
	// find all the partitions from the DB
	let partitions = req.db.get('partitions');
	partitions.find({}).then((docs) => {
		// return them to the user
		res.json({ partitions: docs, success: true });
    });
});

module.exports = router;