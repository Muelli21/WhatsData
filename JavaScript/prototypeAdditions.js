Array.prototype.clear = function() {
    this.length = 0;
};

Array.prototype.remove = function(element) {
    for (var i = this.length; i--;) {
        if (this[i] === element) {
            this.splice(i, 1);
        }
    }
};

Date.prototype.withoutTime = function () {
    var date = new Date(this);
    date.setHours(0, 0, 0, 0);
    return date;
}

Date.prototype.getDDMMYYYYString = function() {
    var date = new Date(this);
    let dd = date.getDate();
    dd = dd.padStart(2, 0);
    let mm = date.getMonth() +1;
    mm = mm.padStart(2, 0);
    let yyyy = date.getFullYear();
    return dd +"/"+mm+"/"+yyyy;
}

Date.prototype.getMonthDayYearString = function() {
    var date = new Date(this);
    let day = date.getDate();
    let month = monthIndexToString(date.getMonth());
    let year = date.getFullYear();
    return month + " " + day + " " + year;
}