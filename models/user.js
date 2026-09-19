const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    roles: {
        type: [String],
        enum: [
            "USER",
            "ADMIN",
            "BARBER"
        ],
        default: ["USER"],
        required: true
    }
    
}, { timestamps: true })

const model = mongoose.model('User', userSchema)

module.exports = model