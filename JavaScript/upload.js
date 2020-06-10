var chat = null;
const MAX_PARTICIPANTS = 5;


/**
 * TO-DO:
 * 
 * Media sent
 * Memo duration per participant
 * Who writes to whom / who starts a conversation?
 * 
 * Conditions for starting a conversation:
 * - the chat was not active for 1 day
 * - technically, it would mean that the message is not written in response to another one
 * - an approximation for guessing whether or not a message 
 *   is written in response to the previous one would be to check for question marks
 * - greetings and words such as "hi", "hey"...
 * 
 * Example: 43.5% of all conversations are started by "name"
 * 
 * Whether conversations are started successfully / successrate for starting a conversation
 * 
 * response time
 * Orthography-check
 * Most active week/month
 * How many files/which files
 * 
 * Active and inactive days could be calculated using the timeline
 * 
 * Colors for Bar charts
 * 
 * 'rgba(27, 204, 183, 0.2)',
 * 'rgba(22, 173, 156, 0.2)',
 * 'rgba(17, 128, 115, 0.2)',
 * 'rgba(14, 100, 90, 0.2)',
 * 'rgba(7, 94, 84, 0.2)',
 * 'rgba(6, 82, 73, 0.2)',
 * 'rgba(5, 56, 63, 0.2)'
 * 
 * Mindestens 3 Doppelpunkte, sonst ist es keine Nachricht. 
 * Bei Android nur 2
 * 
 */

function handleFiles(files) {
    reset();

    const fileList = document.getElementById("fileList");

    if (!files.length) {
        fileList.textContent = "No files selected! \n Please select a .txt-File";
    } else if (files != null) {

        file = document.getElementById('openFile').files[0];

        if (!file.name.includes(".txt")) {
            fileList.textContent = "This is not a text-file!";
            return;
        } else {
            fileList.textContent = "This file appears to be appropriate!";
        }

        processFile();
    }
}

function processFile() {

    let fileReader = new FileReader();
    fileReader.readAsText(file);
    
    fileReader.onload = function () {

        let plainText = this.result;
        chat = new Chat(file, plainText);
        chat.initialize();

        messageFactory();
        console.log("The files have been processed!");
        toggleVisibility(document.getElementById("viewResultsButton"), true);
    }
}

function reset() {
    toggleDisplayVisibility(document.getElementById("results"), false);
    toggleVisibility(document.getElementById("viewResultsButton"), false);
    clearAllSections();

    if (chat != null) {
        chat.reset();
    }
}

function displayResults() {
    let results = document.getElementById("results");
    displayChatInformation();
    displayParticipantsInformation();
    toggleDisplayVisibility(results, true);
    
    $("html, body").animate({ scrollTop: results.offsetTop }, "slow");
}

function displayParticipants(showAll) {

    clearParticipantsButtonsSection();
    chat.setShowAll(showAll);

    let count = 0;
    let parentElementChatSection = document.getElementById("participantsLinks1");
    let parentElementParticipantsSection = document.getElementById("participantsLinks2");
    let participants = chat.getParticipantsArray();

    for (let participant of participants) {

        participantsElement(participant, parentElementChatSection);
        participantsElement(participant, parentElementParticipantsSection);

        if (count >= MAX_PARTICIPANTS && !showAll) {
            showAllParticipantsElement(parentElementChatSection);
            showAllParticipantsElement(parentElementParticipantsSection);
            break;
        }

        if (showAll && count == chat.getParticipantsArray().length - 1) {
            hideAllParticipantsElement(parentElementChatSection);
            hideAllParticipantsElement(parentElementParticipantsSection);
        }

        count++;
    }
}

function displayChatInformation() {

    let fromToDiv = document.getElementById("fromTo");

    createTextElement(fromToDiv, "from " + chat.getStartDate().getMonthDayYearString() + " until " + chat.getEndDate().getMonthDayYearString(), "fromTo");
    displayParticipants(false);

    infoBoxElement(document.getElementById("totals"), chat.getDatesCoveredByChat().length, ["days"]);
    infoBoxElement(document.getElementById("totals"), chat.getAllMessages().length, ["messages"]);
    infoBoxElement(document.getElementById("totals"), chat.getAllWords().length, ["words"]);
    infoBoxElement(document.getElementById("totals"), getAmountOfLetters(chat.getAllWords()), ["letters"]);

    let mostActiveDay = chat.getMostActiveDay();

    infoBoxElement(document.getElementById("activities"), chat.getAverageMessagesPerDay().toFixed(2), ["messages per day"]);
    infoBoxElement(document.getElementById("activities"), mostActiveDay[1].length + " messages were sent", ["on " + mostActiveDay[0].getMonthDayYearString()]);

    streakElement(chat.getChatStreak(), "at least two participants chatted daily");
    streakElement(chat.getNoMessageStreak(), "less than two participants used the chat");
    streakElement(chat.getIgnoredStreak(), "one participant did not get an answer");

    let streakButtonDiv = createHTMLElement(document.getElementById("infoBoxesStreaks"), "div", "streakButtonDiv");
    let button = createButtonElementWithoutFunction(streakButtonDiv, "Show more", "showMoreButton");
    let buttonElement = button[0];
    let buttonTextElement = button[2];
    
    buttonElement.onclick = (function (variable) {
        return function () {
            toggleAdvancedStreakSection(variable);
        };
    })(buttonTextElement);

    createParticipationCharts();

    let peakDays = [chat.getPeakDays()];
    let peakHours = [chat.getPeakHours()];

    createPeakDayChart(peakDays, document.getElementById("peakDayChart"));
    createPeakHourChart(peakHours, document.getElementById("peakHourChart"));
    createMostUsedWordsChart(chat.getMostUsedWords(), document.getElementById("mostUsedWords"));
    createTimelineChart(chat.getTimeline(), document.getElementById("timelineChart"));
}

function displayParticipantsInformation() {

    clearParticipantsSection();

    let peakDays = [];
    let peakHours = [];
    let timelines = [];

    let noParticipantAlertDiv = document.getElementById("noParticipantAlert");
    let participantsContent = document.getElementById("participantsContent");

    if (chat.getDisplayedParticipants().length == 0) {
        toggleDisplayVisibility(noParticipantAlertDiv, true);
        toggleDisplayVisibility(participantsContent, false);

        return;
    } else {
        toggleDisplayVisibility(noParticipantAlertDiv, false);
        toggleDisplayVisibility(participantsContent, true);
    }

    let commonNumberOfWords = getCommonNumberOfWordsWritten(chat.getDisplayedParticipants());
    let numberOfDisplayedParticipants = chat.getDisplayedParticipants().length;

    for (let participant of chat.getDisplayedParticipants()) {

        let totalsElement = createHTMLElement(document.getElementById("participantsTotals"), "div", "participantInformationSection");
        createTextElement(totalsElement, participant.getName(), "participantName");
        infoBoxElement(totalsElement, participant.getAllMessages().length, ["messages"]);
        infoBoxElement(totalsElement, participant.getAllWords().length, ["words"]);
        infoBoxElement(totalsElement, getUniqueWords(participant.getAllWords()).length, ["unique words"]);
        infoBoxElement(totalsElement, participant.getEloquenceRate().toFixed(1), [" unique words per 100 words"]);

        if (numberOfDisplayedParticipants > 1) {
            infoBoxElement(totalsElement, participant.getAdjustedEloquenceRate(commonNumberOfWords).toFixed(1), [" unique words per 100 words", "(adjusted)"]);
        }

        infoBoxElement(totalsElement, getAmountOfLetters(participant.getAllWords()), ["letters"]);

        let activitiesElement = createHTMLElement(document.getElementById("participantsAcitivities"), "div", "participantInformationSection");
        createTextElement(activitiesElement, participant.getName(), "participantName");
        infoBoxElement(activitiesElement, participant.getActiveDays().length, [" of " + chat.getDatesCoveredByChat().length + " days"]);
        infoBoxElement(activitiesElement, participant.getAverageMessagesPerDay().toFixed(2), ["messages per day"]);
        let mostActiveDay = participant.getMostActiveDay();
        infoBoxElement(activitiesElement, mostActiveDay[1].length + " messages were sent", ["on " + mostActiveDay[0].getMonthDayYearString()]);

        peakDays.push(participant.getPeakDays());
        peakHours.push(participant.getPeakHours());
        timelines.push(participant.getTimeline());
        createMostUsedWordsChart(participant.getMostUsedWords(), document.getElementById("participantsMostUsedWordsWrapper"));
    }

    createPeakDayChart(peakDays, document.getElementById("participantsPeakDayChart"));
    createPeakHourChart(peakHours, document.getElementById("participantsPeakHourChart"));
    createTimelineCharts(timelines, document.getElementById("participantsTimelineChart"));
}

