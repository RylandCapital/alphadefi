const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
require('newrelic');



//Middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MonogoDB Atlas Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true,
    useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


//historical data routes
const hist = require('./routes/historical');
app.use('/historical', hist);

//info data routes
const info= require('./routes/info');
app.use('/info', info);

//health check
app.get('/health', (req, res) => {
  res.send('ok')
})

//Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});
