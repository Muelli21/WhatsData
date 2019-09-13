function Participant(name) {

    console.log("The Participant " + name + " has been created!");

    this.name = name;
    this.allMessages = [];
    this.allWords = [];

    this.participationPercentageByMessages = 0;
    this.participationPercentageByWords = 0;
    this.participationPercentageByLetters = 0;
    this.participationPercentageByDays = 0;

    this.lettersWritten = 0;
    this.averageWordLength = 0;
    this.averageMessageLength = 0;

    chat.addParticipant(this.name, this);

    this.getName = function() {
        return this.name;
    }

    this.addMessage = function(message) {
        this.allMessages.push(message);
        
        for (let word of message.getSingleWords()) {
            this.addWord(word);
        }
    }

    this.addWord = function(word) {
        this.allWords.push(word);
        chat.addWord(word);
    }

    this.getAllMessages = function() {
        return this.allMessages;
    }

    this.getAllWords = function() {
        return this.allWords;
    }

    this.getParticipationPercentageByMessages = function() {

        this.participationPercentageByMessages = (this.allMessages.length / chat.getAllMessages().length) *100;
        return this.participationPercentageByMessages;
    }

    this.getParticipationPercentageByLetters = function() {

        this.participationPercentageByLetters = (this.getLettersWritten() / getAmountOfLetters(chat.getAllWords()))*100;
        return this.participationPercentageByLetters;
    }

    this.getParticipationPercentageByWords = function() {

        this.participationPercentageByWords = (this.allWords.length / chat.getAllWords().length)*100;
        return this.participationPercentageByWords;
    }

    this.getParticipationPercentageByDays = function() {

        this.participationPercentageByDays = (this.getActiveDays().length / chat.getDatesCoveredByChat().length)*100;
        return this.participationPercentageByDays;
    }

    this.getWordsWritten = function() {
        return this.allWords.length;
    }

    this.getLettersWritten = function() {

        this.lettersWritten = getAmountOfLetters(this.allWords);
        return this.lettersWritten;
    }

    this.getAverageWordLength = function() {

        this.averageWordLength = (this.lettersWritten / this.wordsWritten);
        return this.averageWordLength;
    }

    this.getAverageMessageLength = function() {

        this.averageMessageLength = (this.wordsWritten / this.allMessages.length);
        return this.averageMessageLength;
    }

    this.getAverageMessagesPerDay = function() {

        let averageMessagesPerDay = this.getAllMessages().length / chat.getDatesCoveredByChat().length;
        return averageMessagesPerDay;
    }

    this.getActiveDays = function() {
        let days = [];
        let dateOfLastMessage = null;

        for (let message of this.allMessages) {
            let date = message.getDate().withoutTime();

            if(dateOfLastMessage == null || !isTheSameDate(date, dateOfLastMessage)) {
                days.push(date);
                dateOfLastMessage = date;
            }
        }

        return days;
    }

    this.isActiveDay = function(date) {
        date = date.withoutTime();
        let array = this.getActiveDays();
        return !!array.find(item => {return item.getTime() == date.getTime()});
    }

    this.getMostUsedWords = function() {
        return getMostUsedWords(this.allWords, 3, 15, this.name);
    }

    this.getPeakHours = function() {
        return getPeakHours(this.allMessages, this.getName());
    }

    this.getPeakDays = function() {
        return getPeakDays(this.allMessages, this.getName());
    }

    this.isDisplayed = function() {
        return chat.getDisplayedParticipants().includes(this);
    }

    this.getTimeline = function() {
        return getTimeline(this.name, this.allMessages);
    }

    this.getMostActiveDay = function() {
        let timeline = this.getTimeline();
        return getMostActiveDay(timeline[0]);
    }

    this.getEloquenceRate = function() {
        let uniqueWords = getUniqueWords(this.allWords);
        let eloquenceRate = (uniqueWords.length/this.allWords.length)*100;

        return eloquenceRate;
    }

    this.getAdjustedEloquenceRate = function(commonNumberOfWords) {
        let words = this.allWords.slice(0, commonNumberOfWords);
        let uniqueWords = getUniqueWords(words);

        let adjustedEloquencyRate = (uniqueWords.length/words.length)*100;
        return adjustedEloquencyRate;
    }
}
