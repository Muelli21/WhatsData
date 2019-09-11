function Message(date, time, participant, message, totalString) {

    this.date = date;
    this.time = time;
    this.participant = participant;
    this.message = message;
    this.totalString = totalString;

    this.getDateString = function() {
        return this.date;
    }

    this.getDate = function() {

        let year = "20" + this.getDateString().slice(6,8);
        let month = this.getDateString().slice(3,5);
        let day = this.getDateString().slice(0,2);

        let hours = this.getTime().slice(0,2);
        let minutes = this.getTime().slice(3,5);
        let seconds = this.getTime().slice(6,8);
        
        let date = new Date(year, month-1, day, hours, minutes, seconds);
        return date;
    }

    this.getTime = function() {
        return this.time;
    }

    this.getParticipant = function() {
        return this.participant;
    }

    this.getMessage = function() {
        return this.message;
    }

    this.getSingleWords = function() {
        return cleanAndSplitIntoWords(this.message);
    }
}

function messageFactory() {
    for(let chatLine of chat.getChatLines()) {

        if (!isMessage(chatLine)) {
            continue;
        }

        let date = getDateFromChatLineString(chatLine);
        let time = getTimeFromChatLineString(chatLine);
        let messageString = getMessageFromChatLineString(chatLine);

        let name = getSenderNameFromChatLineString(chatLine);
        let participant = chat.getParticipant(name);

        let message = new Message(date, time, participant, messageString, chatLine);
        chat.addMessage(message);
        participant.addMessage(message);
    }
}

function isMessage(chatLine) {

    let nonMessageWords = ["video omitted", "document omitted", "Contact card omitted","image omitted", "audio omitted", "<Medien ausgeschlossen>", "<media omitted>", "‎<attached:"];

    for (let string of nonMessageWords) {
       if (chatLine.includes(string)) {
           return false;
       }
    }

    if (chat.isAndroid()) {
        if ((chatLine.match(/\:/g)||[]).length >= 2) {
            return true;
        }
    } else {
        if ((chatLine.match(/\:/g)||[]).length >= 3) {
            return true;
        }
    }
    return false;
}