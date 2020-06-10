
/**
 * Features:
 * - displaying the participants - done
 * - startDate and endDate - done
 * - dates covered by the chat
 * - timeline
 *
 * - most active day - done
 * - chatstreak and No-Message-Streak - done
 *
 * - average messages per day - done
 * - most used words - done
 * - active and inactive days
 * - peakHours and peakDays - done
 * - participation by messages, words, letters, days
 */

const MIN_PARTICIPANTS_FOR_ACTIVE_DAY = 2;
const MAX_PARTICIPANTS_FOR_INACTIVE_DAY = 0;

class Chat {
    constructor(file, plainText) {

        this.file = file;
        this.plainText = plainText;
        this.chatLines;
        this.allMessages = [];
        this.allWords = [];
        this.participantsMap = new Map();
        this.participantsArray = [];
        this.android = false;
        this.displayedParticipants = [];
        this.showAll = false;
        this.showingStreakCharts = false;
    }

    reset() {
        this.allMessages.clear();
        this.allWords.clear();
        this.chatLines.clear();
        this.participantsArray.clear();
        this.participantsMap.clear();
        this.displayedParticipants.clear();
    }

    initialize() {
        checkOperationSystem();
        this.chatLines = splitLines(this.plainText);
    }

    setShowAll(showAll) {
        this.showAll = showAll;
    }

    isShowAll() {
        return this.showAll;
    }

    isShowingStreakCharts() {
        return this.showingStreakCharts;
    }

    setShowingStreakCharts(boolean) {
        this.showingStreakCharts = boolean;
    }

    addParticipant(name, participant) {
        this.participantsArray.push(participant);
        this.participantsMap.set(name, participant);
    }

    getParticipantsArray() {
        return this.participantsArray;
    }

    hasParticipant(name) {
        return this.participantsMap.has(name);
    }

    getParticipant(name) {
        if (!this.hasParticipant(name)) {
            new Participant(name);
        }
        return this.participantsMap.get(name);
    }

    handleDisplayedParticipant(participant) {
        if (this.displayedParticipants.includes(participant)) {
            this.displayedParticipants.remove(participant);
        } else {
            this.displayedParticipants.push(participant);
        }
    }

    getDisplayedParticipants() {
        return this.displayedParticipants;
    }

    isAndroid() {
        return this.android;
    }

    setAndroid(android) {
        this.android = android;
    }

    getPlainText() {
        return this.plainText;
    }

    getAllMessages() {
        return this.allMessages;
    }

    getAllWords() {
        return this.allWords;
    }

    addWord(word) {
        this.allWords.push(word);
    }

    addMessage(message) {
        this.allMessages.push(message);
    }

    getChatLines() {
        return this.chatLines;
    }

    getStartDate() {
        return this.allMessages[0].getDate();
    }

    getEndDate() {
        return this.allMessages[this.allMessages.length - 1].getDate();
    }

    getDatesCoveredByChat() {
        return getDatesInbetween(this.getStartDate(), this.getEndDate());
    }

    getAverageMessagesPerDay() {
        let averageMessagesPerDay = this.getAllMessages().length / chat.getDatesCoveredByChat().length;
        return averageMessagesPerDay;
    }

    getMostUsedWords() {
        return getMostUsedWords(this.allWords, 5, 15, "chat");
    }

    getChatStreak() {
        let activeDays = this.getActiveDays();
        return getDateStreak(activeDays, "Chatstreak");
    }

    getNoMessageStreak() {
        let inactiveDays = this.getInactiveDays();
        return getDateStreak(inactiveDays, "No-message-streak");
    }

    getIgnoredStreak() {
        let ignoredDays = this.getDaysSomeoneIsIgnored();
        return getDateStreak(ignoredDays, "Someone-was-ignored-streak");
    }

    isActiveDay(date) {
        date = date.withoutTime();
        let array = this.getActiveDays();
        return !!array.find(item => { return item.getTime() == date.getTime(); });
    }

    isInactiveDay(date) {
        date = date.withoutTime();
        let array = this.getInactiveDays();
        return !!array.find(item => { return item.getTime() == date.getTime(); });
    }

    getPeakHours() {
        return getPeakHours(this.allMessages, "global");
    }

    getPeakDays() {
        return getPeakDays(this.allMessages, "global");
    }

    getTimeline() {
        return getTimeline("chat-timeline", this.allMessages);
    }

    getMostActiveDay() {
        let timeline = this.getTimeline();
        return getMostActiveDay(timeline[0]);
    }

    getInactiveDays() {
        let daysCount = {};
        for (let date of this.getDatesCoveredByChat()) {
            daysCount[date.getTime()] = 0;
        }
        for (let participant of this.participantsArray) {
            for (let date of participant.getActiveDays()) {
                daysCount[date.getTime()]++;
            }
        }
        let days = [];
        for (let dayTime of Object.keys(daysCount)) {
            if (daysCount[dayTime] <= MAX_PARTICIPANTS_FOR_INACTIVE_DAY) {
                let inactiveDay = new Date();
                inactiveDay.setTime(dayTime);
                days.push(inactiveDay);
            }
        }
        return days;
    }

    getDaysSomeoneIsIgnored() {
        let dates = [];
        let timeline = this.getTimeline();
        let dateEntries = timeline[0];
        let keys = Object.keys(dateEntries);
        let lastActiveParticipants = [];
        
        for (let key of keys) {
            let dateEntry = dateEntries[key];
            let participants = dateEntry.getParticipants();
            if (participants.length == 1) {
                if (lastActiveParticipants.includes(participants[0])) {
                    let date = new Date();
                    date.setTime(key);
                    dates.push(date);
                }
            }
            if (participants.length >= 1) {
                lastActiveParticipants.clear();
                lastActiveParticipants.push(...participants);
            }
            if (participants.length == 0) {
                let date = new Date();
                date.setTime(key);
                dates.push(date);
            }
        }
        return dates;
    }

    getActiveDays() {
        let daysCount = {};
        for (let participant of this.participantsArray) {
            for (let date of participant.getActiveDays()) {
                daysCount[date.getTime()] = daysCount[date.getTime()] || 0;
                daysCount[date.getTime()]++;
            }
        }
        let days = [];
        for (let dayTime of Object.keys(daysCount)) {
            if (daysCount[dayTime] >= MIN_PARTICIPANTS_FOR_ACTIVE_DAY) {
                let activeDay = new Date();
                activeDay.setTime(dayTime);
                days.push(activeDay);
            }
        }
        return days;
    }
}
