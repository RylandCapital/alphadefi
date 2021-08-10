const router = require('express').Router();
let standard = require('../models/standard');

router.route('/tokendict').get((req, res) => {
    standard('tokenDICT').find()
        .then(tokenDICT => res.json(tokenDICT))
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