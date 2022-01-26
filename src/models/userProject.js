const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');
const Schema = mongoose.Schema;
 
const userProjectSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    projectTask: {
        type: Schema.Types.ObjectId,
        ref: 'ProjectTask',
        required: true
    }
}, schemaOptions);

module.exports = mongoose.model('UserProject', userProjectSchema);