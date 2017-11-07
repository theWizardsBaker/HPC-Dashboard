'use strict';
const fileRoot = require('@root')
var uuid = require('node-uuid');
// require router class
const router = require('express').Router();
const fs = require('fs');

// get the current herd for the user
router.get('/all', (req, res) => {
	// find all the jobs from the DB
	let jobs = req.db.get('jobs');

	jobs.find({ user_id: 'letourneaujj' }, {  sort: { job_id: 1 } }).then( (docs) => {
		// return them to the user
		res.json({ jobs: docs, success: true });
    })
});

// get a subset 
router.get('/find/:id', (req, res) => {
	// make sure the name param is provided
	req.checkParams('id', 'Please provide a job number').isNumeric().notEmpty();
	req.sanitizeParams('id').escape();
	// check the validation result
	req.getValidationResult().then((result) => {
		// if we have validation errors
		if (!result.isEmpty()) {
			res.status(400).json({ errors: result.array(), msg: "The submission has errors" });
			return;
		}
		// find all the jobs from the DB
		let jobs = req.db.get('jobs');
		// get jobs
		jobs.find({ job_id: req.params.job_id }).then( (docs) => {
			// return them to the user
			res.json({ jobs: docs, success: true });
	    })
	})
});

router.post('/new', (req, res) => {

	req.checkBody('account', 'Please provide the Account to run under').notEmpty();
    req.sanitize('account').escape();
    req.sanitize('account').trim();

	req.checkBody('modules', 'Error formatting Modules').isArray();
	req.checkBody('partition', 'Please select a Partition to run on').notEmpty();
	req.checkBody('code', 'Please add some code to run').notEmpty();

	// mail-user
	req.checkBody('email', 'Please provide a valid Email Address').optional();
    req.sanitize('email').escape();
    req.sanitize('email').trim();

	// mail-type
	req.checkBody('emailEvents', 'Error formatting Email Events').isArray();
	
	// job-name
	req.checkBody('name', 'Please provide a Job Name').notEmpty();
	req.sanitize('name').escape();
    req.sanitize('name').trim();

	// cpus-per-task
	req.checkBody('cpus', 'Please provide the number of CPUs').isInt();
	// mem / mem-per-cpu
	req.checkBody('memory', 'Please provide the amount of RAM').isInt();
	// time
	req.checkBody('runtime', 'Please provide the run time').notEmpty();
	// nodes
	req.checkBody('nodes', 'Please provide the number of Nodes to run on').isInt();
	// ntasks
	req.checkBody('tasks', 'Please specifiy the number of Tasks per Node').isInt();
	// task-per-cpu
	req.checkBody('tasksPerNode', 'Please specifiy the number of Tasks per CPU').isInt();
	// 
	req.checkBody('advancedSettings', 'invalid param').isBoolean();


	// check the validation result
	req.getValidationResult().then((result) => {
		// if we have validation errors
		if (!result.isEmpty()) { 
			res.status(400).json({ errors: result.array(), success: false });
			return;
		}


		let jobs = req.db.get('jobs');

		// get jobs
		jobs.insert({ 
			job_id: null,
			output_file: uuid.v4(),
			status: 'pending',
			status_reason: 'preparing to submit',
			user_id: 'letourneaujj',
			account: req.body.account,
			modules: req.body.modules,
			partition: req.body.partition,
			code: req.body.code,
			email: req.body.email,
			email_events: req.body.emailEvents,
			name: req.body.name,
			cpus: req.body.cpus,
			memory: req.body.memory,
			runtime: req.body.runtime,
			nodes: req.body.nodes,
			tasks: req.body.tasks,
			tasks_per_node: req.body.tasksPerNode,
			advanced_settings: req.body.advancedSettings,
			submitted: new Date(),
			started: null,
		}).then( (docs) => {

			let file = `
#!/bin/bash

#SBATCH --job-name=${docs.name}
#SBATCH --output=${docs.output_file}.txt
#SBATCH --account=${docs.account}
#SBATCH --partition=${docs.partition}
#SBATCH --nodes=${docs.nodes}
#SBATCH --ntasks=${docs.tasks}
#SBATCH --ntasks-per-node=${docs.tasks_per_node}
#SBATCH --cpus-per-task=${docs.cpus}
#SBATCH --time=0-${docs.runtime.join(':')}
			`
			if(docs.advanced_settings){
				file += ` 
#SBATCH --mem-per-cpu=${docs.memory}G 
				`
			} else {
				file += ` 
#SBATCH --mem=${docs.memory}G 
				`
			}

			if(docs.email.length > 0){
				// add emails
				file += `
#SBATCH --mail-user=${docs.email}
#SBATCH --mail-type=${docs.email_events.join(',')}
				`
			}

			file += `
module purge
module load ${docs.modules.join(', ')}
# code here

${docs.code}
			`


			fs.writeFile(`${docs.name}_${docs._id}.s`, file, (error) => {
				if(error){
					res.status(400).json({ errors: error, success: false });
					return;
				}

				jobs.update({ _id: docs._id }, { $set: { file_text: file } }).then((updatedDoc) => {
					// return them to the user
					res.json({ jobs: docs, success: true });
				}).catch( (error) => {
			    	console.log(error)
			    	res.status(400).json({ errors: error, success: false });
			    })
			})

	    }).catch( (error) => {
	    	console.log(error)
	    	res.status(400).json({ errors: error, success: false });
	    });

	});
})

module.exports = router;