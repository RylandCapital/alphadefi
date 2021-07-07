const mongoose = require('mongoose');
const Schema = mongoose.Schema;


function schemarender(c) {

    const standardSchema = new Schema({
        _id: { type: Number, required: false },
    }, {
      timestamps: true,
      collection: c
    });

    const standard = mongoose.model(c, standardSchema);

    return standard

   }


module.exports = schemarender;




