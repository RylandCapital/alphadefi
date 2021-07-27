const router = require('express').Router();
let standard = require('../models/standard');

router.route('/tokendict').get((req, res) => {
    standard('tokenDICT').find()
        .then(tokenDICT => res.json(tokenDICT))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;