const router = require('express').Router();
let standard = require('../models/standard');
let dayjs = require('dayjs');

const filterParams = (req) => {
    let from = req.params.from || dayjs().subtract(1, 'day')
    let to = req.params.to || dayjs()
    let ticker = req.params.ticker
    return {
        ticker: ticker,
        date: {
            $gte: dayjs(from).toDate(),
            $lt: dayjs(to).toDate()
        }
    }
}

router.route('/spreadhiststats').get((req, res) => {
    standard('spreadHISTSTATS').find()
        .then(spreadHISTSTATS => res.json(spreadHISTSTATS[0]))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/longaprs/:ticker').get((req, res) => {
    standard('HistoricalLongAPRs').find(filterParams(req))
        .then(historicallongaprs => res.json(historicallongaprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/shortaprs/:ticker').get((req, res) => {

    standard('HistoricalShortAPRs').find({ticker: req.params.ticker})
        .then(historicalshortaprs => res.json(historicalshortaprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/comaprs/:ticker').get((req, res) => {

    standard('HistoricalPoolComAPRs').find({pool: req.params.ticker})
        .then(historicalshortaprs => res.json(historicalshortaprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
