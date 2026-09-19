const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const model = mongoose.model("Comment", schema)

module.exports = model