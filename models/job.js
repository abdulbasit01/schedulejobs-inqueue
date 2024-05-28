const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    cronTime: { type: String, required: true },
    task: { type: String, required: true },
    status: { type: String, default: 'inactive' },
    startTime: { type: Date },
    endTime: { type: Date }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
