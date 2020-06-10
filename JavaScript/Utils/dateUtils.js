function getDatesInbetween(startDate, endDate) {

    let dates = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate).withoutTime());
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate = currentDate.withoutTime();
    }

    return dates;
}

function isTheSameDate(date1, date2) {

    date1 = date1.withoutTime();
    date2 = date2.withoutTime();

    if (date1.getTime() == date2.getTime()) {
        return true;
    }

    return false;
}

function dayIndexToDayString(index) {

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[index];
}

function monthIndexToString(index) {

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[index];
}