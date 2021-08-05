const router = require('express').Router();
let standard = require('../models/standard');

router.route('/spreadhiststats').get((req, res) => {
    standard('spreadHISTSTATS').find()
        .then(spreadHISTSTATS => res.json(spreadHISTSTATS))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/historicallongaprs(/:ticker)?').get((req, res) => {
    let fields = {}
    if (req.params.ticker) {
        fields[req.params.ticker] = 1
    }
    standard('HistoricalLongAPRs').find({}, fields)
        .then(historicallongaprs => res.json(historicallongaprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/historicalshortaprs').get((req, res) => {
    standard('HistoricalShortAPRs').find()
        .then(historicalshortaprs => res.json(historicalshortaprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
