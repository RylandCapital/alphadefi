const router = require('express').Router();
let standard = require('../models/standard');
let dayjs = require('dayjs');

var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)


/////// filters/Matches
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

const filterParamsSymbol = (req) => {

    let symbol = req.params.symbol
    return {
        symbol: symbol,
    }
}

const dateRangeDay = (req) => {
    let from = req.query.from 
    let to = req.query.to || dayjs()
    return {
        day: {
            $gte: dayjs(from).toDate(),
            $lt: dayjs(to).toDate()
        },
    }
}

const dateRangeDate = (req) => {
    let from = req.query.from 
    let to = req.query.to || dayjs()
    return {
        date: {
            $gte: dayjs(from).toDate(),
            $lt: dayjs(to).toDate()
        },
    }
}

const matchDate = (req) => {
    let datetime = req.query.datetime || dayjs()
    return {
        Date: { $gte: dayjs(datetime).toDate(), $lt: dayjs(datetime).add(1, 'hour').toDate() }
    }
}

/////// Groups/Aggregate
const groupParamsMean = (req) => {
    if (req.query.precision === 'day') {
        return {
            _id: { $dateToString: { format: "%Y-%m-%d", date: '$date' } },
            date: { $first: { $dateToString: { format: "%Y-%m-%d", date: '$date' } } },
            ticker: { $first: '$ticker' },
            apr: { $avg: '$apr' },
        }
    } else {
        //this returns whatever matches the other parameters unless there is a duplicate DATETIME. all the way to down to ms
        return {
            _id: '$date',
            date: { $first: '$date' },
            ticker: { $first: '$ticker' },
            apr: { $first: '$apr' }
        }
    }
}

const groupParamsValueMean = (req) => {
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

const groupParamsValueUSTMC = (req) => {
        return {
            _id: { $dateToString: { format: "%Y-%m-%d", date: '$date' } },
            date: { $last: { $dateToString: { date: '$date' } } },
            value: { $last: '$ust_circulating_supply' },
        }
    } 

const groupParamsCoinMC = (req) => {
        return {
            _id: { $dateToString: { format: "%Y-%m-%d", date: '$last_updated' } },
            date: { $last: { $dateToString: { date: '$last_updated' } } },
            market_cap: { $last: '$quote' },
            circulating_supply: { $last: '$circulating_supply' },
            total_supply: { $last: '$total_supply' },
            cmc_rank: { $last: '$cmc_rank' },
        }
    } 








//////routes
router.route('/terra/ustmc').get((req, res) => {
    standard('ustMC')
        .aggregate([
            { $match : dateRangeDate(req) },
            { $group: groupParamsValueUSTMC(req) },
            { $sort: { date : 1 } },

        ])
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/coinmarketcaps/:symbol').get((req, res) => {
    standard('coinmarketcaps')
        .aggregate([
            { $match : filterParamsSymbol(req) },
            { $group: groupParamsCoinMC(req) },
            { $sort: { date : 1 } },

        ])
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/kujira/liquidations').get((req, res) => {
    standard('kujiraLiquidations')
        .aggregate([
            { $match : dateRangeDay(req) },
            { $sort: { executed_at : 1 } },
        ])
        .limit(1000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/kujira/profiles').get((req, res) => {
    standard('historicalLiqProfiles')
        .aggregate([
            { $match : matchDate(req)},
            { $sort: { Date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});


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
            { $group: groupParamsMean(req) },
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
            { $group: groupParamsMean(req) },
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
            { $group: groupParamsMean(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/aprcompare/:ticker').get((req, res) => {
    standard('HistoricalAPRCompare')
        .aggregate([
            { $match : filterParams(req) },
            { $group: groupParamsMean(req) },
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
            { $group: groupParamsMean(req) },
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
            { $group: groupParamsMean(req) },
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
            { $group: groupParamsValueMean(req) },
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
            { $group: groupParamsValueMean(req) },
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
            { $group: groupParamsValueMean(req) },
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
            { $group: groupParamsValueMean(req) },
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
            { $group: groupParamsValueMean(req) },
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
            { $group: groupParamsValueMean(req) },
            { $sort: { date : 1 } },
        ])
        .limit(2000)
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;


router.route('/kujira/profile').get((req, res) => {
    standard('liqprofile').find()
        .then(aprs => res.json(aprs))
        .catch(err => res.status(400).json('Error: ' + err));
});








module.exports = router;
