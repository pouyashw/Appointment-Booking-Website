const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours && minutes) {
        return `${hours} ساعت و ${minutes} دقیقه`;
    }

    if (hours) {
        return `${hours} ساعت`;
    }

    return `${minutes} دقیقه`;
}

module.exports = formatDuration;