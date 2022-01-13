const router = require('express').Router();
let standard = require('../models/standard');
let dayjs = require('dayjs');

const filterParams = (req) => {
    let from = req.query.from || dayjs().subtract(1, 'month')
    let to = req.query.to || dayjs()
    let ticker = req.params.ticker
    return {
        ticker: ticker,
        date: {
            $gte: dayjs(from).toDate(),
            $lt: dayjs(to).toDate()
        },
    }
}

const groupParams = (req) => {
    if (req.query.precision === 'day') {
        return {
            _id: { $dateToString: { format: "%Y-%m-%d", date: '$date' } },
            date: { $first: { $dateToString: { format: "%Y-%m-%d", date: '$date' } } },
            ticker: { $first: '$ticker' },
            apr: { $avg: '$apr' },
        }
    } else {
        return {
            _id: '$date',
            date: { $first: '$date' },
            ticker: { $first: '$ticker' },
            apr: { $first: '$apr' }
        }
    }
}

const groupParamsValue = (req) => {
    if (req.query.precision === 'day') {
        return {
            _id: { $dateToString: { format: "%Y-%m-%d", date: '$date' } },
            date: { $first: { $dateToString: { format: "%Y-%m-%d", date: '$date' } } },
            ticker: { $first: '$ticker' },
            value: { $avg: '$value' },
        }
    } else {
        return {
            _id: '$date',
            date: { $first: '$date' },
            ticker: { $first: '$ticker' },
            value: { $first: '$value' },
        }
    }
}

router.route('/spreadhiststats').get((req, res) => {
    standard('spreadHISTSTATS').find()
        .then(spreadHISTSTATS => res.json(spreadHISTSTATS))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/poolhiststats').get((req, res) => {
    standard('poolHISTSTATS').find()
        .then(spreadHISTSTATS => res.json(spreadHISTSTATS))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/longaprs/:ticker').get((req, res) => {
    standard('HistoricalLongAPRs')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParams(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/shortaprs/:ticker').get((req, res) => {
    standard('HistoricalShortAPRs')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParams(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/comaprs/:ticker').get((req, res) => {
    standard('HistoricalPoolComAPRs')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParams(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/astrocomaprs/:ticker').get((req, res) => {
    standard('HistoricalAstroPoolComAPRs')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParams(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/astroallinaprs/:ticker').get((req, res) => {
    standard('HistoricalAstroPoolAllInAPRs')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParams(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/ltvs/:ticker').get((req, res) => {
    standard('ltvs')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsValue(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/volumes/:ticker').get((req, res) => {
    standard('volumes')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsValue(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/prices/:ticker').get((req, res) => {
    standard('prices')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsValue(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/anchor/:ticker').get((req, res) => {
    standard('HistoricalAnchor')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsValue(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/nexus/:ticker').get((req, res) => {
    standard('nexusVaults')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsValue(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;

router.route('/terradashboard/:ticker').get((req, res) => {
    standard('dashboard')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsValue(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;
