const router = require('express').Router();
let standard = require('../models/standard');

router.route('/spreadhiststats').get((req, res) => {
    standard('spreadHISTSTATS').find()
        .then(spreadHISTSTATS => res.json(spreadHISTSTATS))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;