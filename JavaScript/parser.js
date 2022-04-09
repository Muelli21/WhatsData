const dateTimePatterns = [
    "X/XX/XX, XX:XX -",
    "XX/X/XX, XX:XX -",
    "X/X/XX, XX:XX -",
    "XX/XX/XX, XX:XX -",

    "XX.XX.XX, XX:XX -",

    "[XX.XX.XX, XX:XX:XX]",
    "[XX/XX/XXXX, XX:XX:XX]"
];

function dateTimePatternToRegExpression(dateTimePattern) {

    let regExpression;
    regExpression = dateTimePattern.replace(/X/g, "\\d");
    regExpression = regExpression.replace(/\//g, "\\/");
    regExpression = regExpression.replace(/\,/g, "\\,");
    regExpression = regExpression.replace(/\:/g, "\\:");
    regExpression = regExpression.replace(/\-/g, "\\-");
    regExpression = regExpression.replace(/\[/g, "\\[");
    regExpression = regExpression.replace(/\]/g, "\\]");

    return new RegExp(regExpression, 'g');
}

function getArrayOfMatches(text, regExpression) {

    let matches = [];
    let match;

    while ((match = regExpression.exec(text)) != null) {
        let lastIndex = regExpression.lastIndex;
        let index = match.index;
        let result = [lastIndex, index];
        matches.push(result);
    }

    return matches;
}

function checkOperationSystem() {
    
    let plainText = chat.getPlainText();
    let firstCharacter = plainText.charAt(0);

    plainText = plainText.trim();

    if (firstCharacter != "[") {
        chat.setAndroid(true);
        console.log("Operationsystem: Android");
    } else {
        console.log("Operationsystem: iOS");
    }
}

function splitLines(plainText) {

    let lines = [];
    let lastSlice = 0;

        
    let regExpression = /(\[*\d*(?:\/|\.)\d*(?:\/|\.)\d*\,\s\d*:\d*(?::|\s)\d*\-*\]*)/g;
    let matches = getArrayOfMatches(plainText, regExpression);

    for (let match of matches) {
        
        let index = match[1];

        if (index == null) { continue; }
        
        let chatLine = plainText.slice(lastSlice, index);

        lines.push(chatLine);
        lastSlice = index;
    }

    lines = lines.slice(1);
    return lines;
}

function cleanAndSplitIntoWords(text) {

    let temp = text.replace(/\.|\,|\:|\;|\?|\!|\"|\'|\(|\)|\.+/g, " ");
    
    temp = temp.replace(/\s\s+/g, " ");
    return temp.trim().split(" ");
}

function getDateFromChatLineString(chatLine) {

    let dateString = chatLine.trim();

    dateString = dateString.slice(0, dateString.indexOf(","));
    dateString = dateString.replace("[", "");

    if (dateString.includes("/")) {
        if (chat.isAndroid()) {
            let month = dateString.slice(0, dateString.indexOf("/"));
            month = month.padStart(2, 0);

            let withoutMonth = dateString.slice(dateString.indexOf("/") + 1, dateString.length);

            let day = withoutMonth.slice(0, withoutMonth.indexOf("/"));
            day = day.padStart(2, 0);

            let year = withoutMonth.slice(withoutMonth.indexOf("/") + 1, withoutMonth.length);
            dateString = day + "." + month + "." + year;

        } else {

            let day = dateString.dateString.slice(0, dateString.indexOf("/"));
            let withoutDay = dateString.slice(dateString.indexOf("/") + 1, dateString.length);
            let month = withoutDay.slice(0, dateString.indexOf("/"));
            let year = withoutDay.slice(withoutDay.indexOf("/") + 1, withoutDay.length);
            dateString = day + "." + month + "." + year;
        }
    }

    let splittedString = dateString.split(".");

    if(splittedString[2].length < 4) { 
        splittedString[2] = "20" + splittedString[2]; 
        dateString = splittedString.join(".");
    }

    return dateString;
}

function getTimeFromChatLineString(chatLine) {

    let timeString = chatLine.trim();

    timeString = chatLine.slice(timeString.indexOf(",") + 2, timeString.indexOf(",") + 2 + 5);

    if (chat.isAndroid()) { timeString = timeString + ":00"; }

    return timeString;
}

function getMessageWithoutTimeAndDate(chatLine) {

    let cleanMessage = chatLine.trim();

    if (chat.isAndroid()) {
        cleanMessage = cleanMessage.slice(cleanMessage.indexOf("-") + 2, cleanMessage.length);
    } else {
        cleanMessage = cleanMessage.slice(cleanMessage.indexOf("]") + 2, cleanMessage.length);
    }

    return cleanMessage;
}

function getSenderNameFromChatLineString(chatLine) {
    
    let cleanMessage = getMessageWithoutTimeAndDate(chatLine);
    let endIndex = cleanMessage.indexOf(": ");
    let senderString = cleanMessage.slice(0, endIndex);

    return senderString;
}

function getMessageFromChatLineString(chatLine) {
    
    let cleanMessage = getMessageWithoutTimeAndDate(chatLine);
    let startIndex = cleanMessage.indexOf(": ") + 2;
    let messageString = cleanMessage.slice(startIndex, cleanMessage.length);

    return messageString;
}


