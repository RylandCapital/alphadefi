const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();



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
const spreadhiststats = require('./routes/historical');
app.use('/historical', spreadhiststats);

//info data routes
const tokendict= require('./routes/info');
app.use('/info', tokendict);


//Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});