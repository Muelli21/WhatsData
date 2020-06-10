class DateEntry {
    constructor(date) {
        this.date = date;
        this.messages = [];
        this.participants = [];
    }

    addMessage(message) {
        this.messages.push(message);
    }

    addParticipant(participant) {
        if (!this.participants.includes(participant)) {
            this.participants.push(participant);
        }
    }

    getMessages() {
        return this.messages;
    }

    getParticipants() {
        return this.participants;
    }
}
