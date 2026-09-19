const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    description: String,

    isActive: {
        type: Boolean,
        default: true
    }
})

schema.virtual("formattedDuration").get(function () {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;

    if (hours && minutes)
        return `${hours} ساعت و ${minutes} دقیقه`;

    if (hours)
        return `${hours} ساعت`;

    return `${minutes} دقیقه`;
});

schema.set("toJSON", { virtuals: true });

const model = mongoose.model('Service', schema)

module.exports = model