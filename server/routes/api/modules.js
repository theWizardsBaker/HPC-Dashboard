'use strict';
// require router class
const router = require('express').Router();

// get the current herd for the user
router.get('/all', (req, res) => {
	// find all the modules from the DB
	let modules = req.db.get('modules');

	modules.find({}, {  sort: { search_name: 1 } }).then( (docs) => {
		// return them to the user
		res.json({ modules: docs, success: true });
    })
});
// get a subset 
router.get('/find/:name', (req, res) => {
	// make sure the name param is provided
	req.checkParams('name', 'Please provide a search parameter').notEmpty();
	req.sanitizeParams('name').escape();
	// check the validation result
	req.getValidationResult().then((result) => {
		// if we have validation errors
		if (!result.isEmpty()) {
			res.status(400).json({ errors: result.array(), msg: "The submission has errors" });
			return;
		}
		let mod_name = req.params.name;
		// regex to match
		let matcher = new RegExp(`^${mod_name}`, 'gi');
		// find all the modules from the DB
		let modules = req.db.get('modules');
		// get modules
		modules.find({ search_name: matcher }, { sort: { search_name: 1 } }).then( (docs) => {
			// return them to the user
			res.json({ modules: docs, success: true });
	    })
	})
});

module.exports = router;