'use strict';

// Require router class
const router = require('express').Router();
// require JWT security

router.get('/', (req, res) => {
  res.send('Hello from the HPC API!');
});

// // split up route handling
router.use('/partitions', require('./partitions'));
router.use('/modules', require('./modules'));
router.use('/groups', require('./groups'));
router.use('/jobs', require('./jobs'));

module.exports = router;