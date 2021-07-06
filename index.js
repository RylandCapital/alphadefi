const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


//const spxRouter = require('./routes/spx');
//app.use('/spx', spxRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});