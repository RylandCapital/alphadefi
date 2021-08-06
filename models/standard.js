const mongoose = require('mongoose');
const Schema = mongoose.Schema;


function schemarender(c,ticker) {

    const standardSchema = new Schema({
        _id: { type: Number, required: false },
        
    }, {
      timestamps: true,
      collection: c
    });

    try{
    return mongoose.model(c, standardSchema);
    } catch {
    return mongoose.model(c)
    }
   }


module.exports = schemarender;




