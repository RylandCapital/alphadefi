const router = require('express').Router();
let standard = require('../models/standard');

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

router.route('/longvolrankings').get((req, res) => {
    standard('LongVolRankings').find()
        .then(longvolrankings => res.json(longvolrankings))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/shortvolrankings').get((req, res) => {
    standard('ShortVolRankings').find()
        .then(shortvolrankings => res.json(shortvolrankings))
        .catch(err => res.status(400).json('Error: ' + err));
});




module.exports = router;