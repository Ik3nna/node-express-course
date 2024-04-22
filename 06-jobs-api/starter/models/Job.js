const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxLength: 50
    },
    postion: {
        type: String,
        required: [true, 'Please provide position'],
        maxLength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'] 

        // The type is just a way of tying the createdBy to the user schema, so that when a job is created
        // it will be associated with the user. ref, just tells you which model that is referenced.
    }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema)