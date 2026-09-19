const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    barber: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    service: {
        type: [mongoose.Types.ObjectId],
        ref: "Service",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "PENDING",
            "CONFIRMED",
            "REJECTED",
            "DONE",
            "CANCELLED"
        ],
        default: "PENDING"
    }
})

const model = mongoose.model("Appointment", schema)

module.exports = model