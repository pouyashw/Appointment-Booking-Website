const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BARBER",
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    caption: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true })

const model = mongoose.model("Portfolio", schema)

module.exports = model