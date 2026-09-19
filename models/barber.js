const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    }],

    workDays: {
        type: [String],
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default: null
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const model = mongoose.model('BARBER', schema)

module.exports = model