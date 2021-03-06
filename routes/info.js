const router = require('express').Router();
let standard = require('../models/standard');

router.route('/dexpooldict').get((req, res) => {
    standard('dexpoolDICT').find()
        .then(tokenDICT => res.json(tokenDICT))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/tokendict').get((req, res) => {
    standard('tokenDICT').find()
        .then(tokenDICT => res.json(tokenDICT))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/pooldict').get((req, res) => {
    standard('poolDICT').find()
        .then(poolDICT => res.json(poolDICT))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/nexusdict').get((req, res) => {
    standard('nexusDict').find()
        .then(poolDICT => res.json(poolDICT))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/dashboarddict').get((req, res) => {
    standard('dashboardDict').find()
        .then(dashboardDict => res.json(dashboardDict))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/astrodict').get((req, res) => {
    standard('astroDict').find()
        .then(dashboardDict => res.json(dashboardDict))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/anchordict').get((req, res) => {
    standard('anchor_dict').find()
        .then(anchor_dict => res.json(anchor_dict))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/aprcompare').get((req, res) => {
    standard('aprCompare').find()
        .then(aprCompare => res.json(aprCompare))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/liqprofile').get((req, res) => {
    standard('liqprofileSTATS').find()
        .then(aprCompare => res.json(aprCompare))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/liqstakingdict').get((req, res) => {
    standard('liqStakingDict').find()
        .then(aprCompare => res.json(aprCompare))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/txfailratios').get((req, res) => {
    standard('txFailRate').find()
        .then(aprCompare => res.json(aprCompare))
        .catch(err => res.status(400).json('Error: ' + err));
});





module.exports = router;