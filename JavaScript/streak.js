function Streak(startDate, endDate, streakLength, type) {

    this.startDate = startDate;
    this.endDate = endDate;
    this.streakLength = streakLength;
    this.type = type;

    this.getStartDate = function () {
        return this.startDate;
    }

    this.getEndDate = function () {
        return this.endDate;
    }

    this.getStreakLength = function () {
        return this.streakLength + 1;
    }

    this.getType = function () {
        return this.type;
    }
}