const calcTimeAgo = (notificationDate) => {
    const currentDate = new Date();
    let timeDifferenceMillis = null;
    let daysDifference = null;
    let hoursDifference = null;
    let minutesDifference = null;

    timeDifferenceMillis = currentDate - notificationDate;
    daysDifference = Math.floor(timeDifferenceMillis / (1000 * 60 * 60 * 24));
    hoursDifference = Math.floor((timeDifferenceMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutesDifference = Math.floor((timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60));

    if (daysDifference > 0) {
        timeAgo = `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else if (hoursDifference > 0) {
        timeAgo = `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    } else if (minutesDifference > 0) {
        timeAgo = `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
    } else {
        timeAgo = 'just now';
    }

    return timeAgo;
}

module.exports = {
    calcTimeAgo
}