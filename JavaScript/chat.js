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


function Chat(file, plainText) {
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

    this.reset = function() {
        this.allMessages.clear();
        this.allWords.clear();
        this.chatLines.clear();
        this.participantsArray.clear();
        this.participantsMap.clear();
        this.displayedParticipants.clear();
    } 

    this.initialize = function() {
        checkOperationSystem();
        this.chatLines = splitLines(this.plainText);
    }

    this.setShowAll = function(showAll) {
        this.showAll = showAll;
    }

    this.isShowAll = function() {
        return this.showAll;
    }

    this.addParticipant = function(name, participant) {
        this.participantsArray.push(participant);
        this.participantsMap.set(name, participant);
    }

    this.getParticipantsArray = function() {
        return this.participantsArray;
    }

    this.hasParticipant = function(name) {
        return this.participantsMap.has(name);
    }

    this.getParticipant = function(name) {

        if(!this.hasParticipant(name)) {
            new Participant(name);
        }

        return this.participantsMap.get(name);
    }

    this.handleDisplayedParticipant = function(participant) {
        if (this.displayedParticipants.includes(participant)) {
            this.displayedParticipants.remove(participant);
        } else {
            this.displayedParticipants.push(participant);
        }
    }

    this.getDisplayedParticipants = function() {
        return this.displayedParticipants;
    }

    this.isAndroid = function() {
        return this.android;
    }

    this.setAndroid = function(android) {
        this.android = android;
    }

    this.getPlainText = function() {
        return this.plainText;
    }

    this.getAllMessages = function() {
        return this.allMessages;
    }

    this.getAllWords = function() {
        return this.allWords;
    }

    this.addWord = function(word) {
        this.allWords.push(word);
    }

    this.addMessage = function(message) {
        this.allMessages.push(message);
    }

    this.getChatLines = function() {
        return this.chatLines;
    }

    this.getStartDate = function() {
        return this.allMessages[0].getDate();
    }

    this.getEndDate = function() {
        return this.allMessages[this.allMessages.length - 1].getDate();
    }

    this.getDatesCoveredByChat = function() {
        return getDatesInbetween(this.getStartDate(), this.getEndDate());
    }

    this.getAverageMessagesPerDay = function() {
        
        let averageMessagesPerDay = this.getAllMessages().length / chat.getDatesCoveredByChat().length;
        return averageMessagesPerDay;
    }

    this.getMostUsedWords = function() {
        return getMostUsedWords(this.allWords, 5, 15, "chat");
    }

    this.getChatStreak = function() {

        let activeDays = this.getActiveDays();
        return getDateStreak(activeDays);
    }

    this.getNoMessageStreak = function() {

        let inactiveDays = this.getInactiveDays();
        return getDateStreak(inactiveDays);
    }

    this.getActiveDays = function() {

        const MIN_PARTICIPANTS_FOR_ACTIVE_DAY = 2;
        let daysCount = {};
        
        for(let participant of this.participantsArray) {
            for (let date of participant.getActiveDays()) {
                daysCount[date.getTime()] = daysCount[date.getTime()] || 0;
                daysCount[date.getTime()]++;
            }
        }

        let days = [];

        for (let dayTime of Object.keys(daysCount)) {
            if(daysCount[dayTime] >= MIN_PARTICIPANTS_FOR_ACTIVE_DAY) {
                let activeDay = new Date();
                activeDay.setTime(dayTime);
                days.push(activeDay);
            }
        }

        return days;
    }

    this.isActiveDay = function(date) {
        date = date.withoutTime();
        let array = this.getActiveDays();
        return !!array.find(item => {return item.getTime() == date.getTime()});
    }

    this.isInactiveDay = function(date) {
        date = date.withoutTime();
        let array = this.getInactiveDays();
        return !!array.find(item => {return item.getTime() == date.getTime()});
    }

    this.getInactiveDays = function() {
        
        const MAX_PARTICIPANTS_FOR_INACTIVE_DAY = 0;
        let daysCount = {};

        for (let date of this.getDatesCoveredByChat()) {
            daysCount[date.getTime()] = 0;
        }

        for(let participant of this.participantsArray) {
            for (let date of participant.getActiveDays()) {
                daysCount[date.getTime()]++;
            }
        }

        let days = [];

        for (let dayTime of Object.keys(daysCount)) {
            if(daysCount[dayTime] <= MAX_PARTICIPANTS_FOR_INACTIVE_DAY) {
                let inactiveDay = new Date();
                inactiveDay.setTime(dayTime);
                days.push(inactiveDay);
            }
        }

        return days;
    }

    this.getPeakHours = function() {
        return getPeakHours(this.allMessages, "global");
    }

    this.getPeakDays = function() {
        return getPeakDays(this.allMessages, "global");
    }

    this.getTimeline = function() {
        return getTimeline("chat-timeline", this.allMessages);
    }

    this.getMostActiveDay = function() {
        let timeline = this.getTimeline();
        return getMostActiveDay(timeline[0]);
    }
}