const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');
 
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, schemaOptions);

module.exports = mongoose.model('Project', projectSchema);