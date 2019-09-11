// As you can see in the following examples, different patterns have to be recognized in order to split the lines correctly. 
// This inconvenience is caused by the inability of the WhatsApp-developers to format dates correctly and uniformly on all operation systems


// 3/17/19, 01:44 - Anne: I will be there at 6 o'clock
// 23.09.18, 21:14 - Martha: nothing
// [29.07.18, 13:06:21] Mike: What's going on?
// [20/07/2019, 17:13:32] Peter: I will be there in a few seconds

const dateTimePatterns = [
    "X/XX/XX, XX:XX -",
    "XX/X/XX, XX:XX -",
    "X/X/XX, XX:XX -",
    "XX/XX/XX, XX:XX -",

    "XX.XX.XX, XX:XX -",

    "[XX.XX.XX, XX:XX:XX]",
    "[XX/XX/XXXX, XX:XX:XX]"
];

function dateTimePatternToRegExpressions(dateTimePattern) {

    let regExpression;
    regExpression = dateTimePattern.replace(/X/g,"\\d");
    regExpression = regExpression.replace(/\//g,"\\/");
    regExpression = regExpression.replace(/\,/g,"\\,");
    regExpression = regExpression.replace(/\:/g,"\\:");
    regExpression = regExpression.replace(/\-/g,"\\-");
    regExpression = regExpression.replace(/\[/g,"\\[");
    regExpression = regExpression.replace(/\]/g,"\\]");

    return new RegExp(regExpression, 'g');
}

function getArrayOfMatches(text, regExpression) {

    let matches = [];
    let match;

    while((match = regExpression.exec(text)) != null) {
        let lastIndex = regExpression.lastIndex;
        let index = match.index;
        let result = [lastIndex, index];
        matches.push(result);
    }

    return matches;
}


function splitLines(plainText) {

    let lines = [];
    let lastSlice = 0;

    for (let pattern of dateTimePatterns) {
        let regExpression = dateTimePatternToRegExpressions(pattern);

        let matches = getArrayOfMatches(plainText, regExpression);
        
        for (let match of matches) {
            let index = match[1];

            if(index == null) {
                continue;
            }

            let chatLine = plainText.slice(lastSlice, index);
            lines.push(chatLine);
            lastSlice = index;
        }
    }   
    return lines;
}

function checkOperationSystem() {
    let plainText = chat.getPlainText();
    plainText = plainText.trim();
    let firstCharacter = plainText.charAt(0);

    if (firstCharacter != "[") {
        chat.setAndroid(true);
        console.log("Operationsystem: Android");
    } else {
        console.log("Operationsystem: iOS");
    }
}

function toggleVisibility(element, boolean) {
    if (boolean) {
        element.style.visibility = "visible";
    } else {
        element.style.visibility = "hidden";
    }
}

function toggleVisibilityUsingHeight(element, boolean) {
    if (boolean) {

        let combinedHeight = 100;
        for(let childElement of element.childNodes) {
            let height = childElement.offsetHeight;

            if(!isNaN(height)) {
                console.log(height);
                combinedHeight = combinedHeight + height;
            }
        }

        element.style.height = combinedHeight;
    } else {
        element.style.height = 0;
    }
}

function toggleDisplayVisibility(element, boolean) {
    if (boolean) {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

// 3/17/19 Android english
// 25.07.18 Android german
// 23.09.18 IOS german
// 20/07/2019 IOS english

function getDateFromChatLineString(chatLine) {

    let dateString = chatLine.trim();
    dateString = dateString.slice(0,dateString.indexOf(","));
    dateString = dateString.replace("[","");

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

    return dateString;
}

function getTimeFromChatLineString(chatLine) {

    let timeString = chatLine.trim();
    timeString = chatLine.slice(timeString.indexOf(",") + 2, timeString.indexOf(",") + 2 + 5);

    if(chat.isAndroid()) {
        timeString = timeString + ":00";
    }

    return timeString;
}

function getMessageWithoutTimeAndDate(chatLine) {

    let cleanMessage = chatLine.trim();
    if(chat.isAndroid()) {
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

function cleanAndSplitIntoWords(text) {

    let temp = text.replace(/\.|\,|\:|\;|\?|\!|\"|\'|\(|\)|\.+/g," ");
    temp = temp.replace(/\s\s+/g," ");
    return temp.trim().split(" ");
}

function getAmountOfLetters(arrayOfWords) {
    let amount = 0;

    for (let word of arrayOfWords) {
        for(let letter of word) {
            amount++;
        }
    }

    return amount;
}

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

function countWords(arrayOfWords, minWordLength) {
    let mapOfCountedWords = {};

    for (let word of arrayOfWords) {
        if (word.length >= minWordLength) {
            word = word.toLowerCase();
            mapOfCountedWords[word] = mapOfCountedWords[word] || 0;
            mapOfCountedWords[word]++;
        }
    }

    return mapOfCountedWords;
}

function getMostUsedWords(arrayofWords, minWordLength, amountOfWords, owner) {

    let mostUsedWords = [];
    let mostUsedWordsCount = [];
    let mapOfCountedWords = countWords(arrayofWords, minWordLength);

    let words = Object.keys(mapOfCountedWords);

    mostUsedWords = words.sort(function (a,b) { 
        return mapOfCountedWords[b] -mapOfCountedWords[a];
    });

    if (mostUsedWords.length > amountOfWords) {
        mostUsedWords = mostUsedWords.slice(0,amountOfWords);
    } 

    for (key of mostUsedWords) {
        let count = mapOfCountedWords[key];
        mostUsedWordsCount.push(count);
    }
    
    return [mostUsedWords, mostUsedWordsCount, owner];
}

function isTheSameDate(date1, date2) {

    date1 = date1.withoutTime();
    date2 = date2.withoutTime();
    
    if (date1.getTime() == date2.getTime()) {
        return true;
    }

    return false;
}

function getDateStreak(dates) {

    let previousDate = dates[0] || new Date();
    let globalStreak = 0;
    let globalStreakStartIndex = 0;
    let streak = 0;
    let streakStartIndex = 0;

    for(i = 0; i<dates.length; i++) {

        let currentDate = dates[i];
        let calculatedDate =  new Date(currentDate);
        calculatedDate.setDate(currentDate.getDate() - 1);

        if(isTheSameDate(previousDate, calculatedDate)) {
            streak++;
            
        } else {

            if (streak > globalStreak) {
                globalStreak = streak;
                globalStreakStartIndex = streakStartIndex;
            }

            streak = 0;
            streakStartIndex = i;
        }

        previousDate = currentDate;
    }

    let startDate = dates[globalStreakStartIndex];
    let endDate = dates[globalStreakStartIndex + globalStreak];
    return [startDate, endDate, globalStreak];
}

function getPeakHours(allMessages, origin) {

    let messagesPerHour = {};
    let peakHour = null;

    for (i=0;i<=23;i++) {
        messagesPerHour[i] = 0;
    }

    for (let message of allMessages) {

        let hour = message.getDate().getHours();
        messagesPerHour[hour]++;

        if (peakHour = null || messagesPerHour[hour] > messagesPerHour[peakHour]) {
            peakHour = hour;
        }
    }
        
    return [peakHour, messagesPerHour, origin];
}

function dayIndexToDayString(index) {

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[index];
}

function monthIndexToString(index) {

    let months = ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"]
    return months[index];
}

function getPeakDays(allMessages, origin) {

    let messagesPerDay = {};
    let peakDay = null;

    for (i=0;i<=6;i++) {
        messagesPerDay[dayIndexToDayString(i)] = 0;
    }

    for (let message of allMessages) {

        let day = dayIndexToDayString(message.getDate().getDay());
        messagesPerDay[day]++;
        
        if (peakDay = null || messagesPerDay[day] > messagesPerDay[peakDay]) {
            peakDay = day;
        }
    }
        
    return [peakDay, messagesPerDay, origin];
}

function getTimeline(owner, allMessages) {

    let dates = {};
    let startDate = allMessages[0].getDate() || new Date();
    let endDate = allMessages[allMessages.length -1].getDate() || new Date();

    let allDates = getDatesInbetween(startDate, endDate);

    for (let date of allDates) {
        dates[date.getTime()] = [];
    }

    for (let message of allMessages) {
        let date = message.getDate().withoutTime();
        dates[date.getTime()].push(message);
    }

    return [dates, owner];
}

function getTimelineToPrint(dates) {

    let allDates = Object.keys(dates);
    let dateArray = [];
    let amountOfMessagesPerDate = [];

    for (let date of allDates) {
        let realDate = new Date();
        realDate.setTime(date);
        dateArray.push(realDate.getMonthDayYearString());
        let messages = dates[date];
        amountOfMessagesPerDate.push(messages.length);
    }
    return [dateArray, amountOfMessagesPerDate];
}

function getMostActiveDay(timeline) {

    let mostActiveDay;
    let messagesAtTheDay = [];
    let dates = Object.keys(timeline);

    for (let date of dates) {
        let messages = timeline[date];

        if (messages.length > messagesAtTheDay.length) {
            mostActiveDay = date;
            messagesAtTheDay = messages;
        }
    }

    let date = new Date();
    date.setTime(mostActiveDay);

    return [date, messagesAtTheDay];
}

function streaksElement(chatStreak, type,  description) {
    let streaksDiv = document.getElementById("streaks");

    let fact = chatStreak[2] + " day " + type;
    let dates = "From " + chatStreak[0].getMonthDayYearString() + " to " + chatStreak[1].getMonthDayYearString();
    let descriptionArray = [dates, description];
    infoBoxElement(streaksDiv, fact, descriptionArray);
}

function infoBoxElement(parentElement, fact, descriptionArray) {

    let div = createHTMLElement(parentElement, "div", "infoBoxDiv");
    createHeadline(div, fact, "h2", "infoBoxFact");

    for (let description of descriptionArray) {
        createTextElement(div, description, "infoBoxDescription");
    }
}

function participantsElement(participant, parentElement) {

    let participantDiv1 = createHTMLElement(parentElement, "div", "participantDiv");
    let button = createButtonElement(participantDiv1, participant.getName(), "participantButton", (function(variable) {
        return function() {
            handleParticipant(variable);
        };
    })(participant));

    let labelElement = button[2];
    if (participant.isDisplayed()) {
        labelElement.classList.add("displayedParticipantButton");
    }
}

function showAllParticipantsElement(parentElement) {

    let participantDiv1 = createHTMLElement(parentElement, "div", "participantDiv");
    createButtonElement(participantDiv1, "Show all", "toggleParticipantsButton", function() {
        displayParticipants(true);
    });
}

function hideAllParticipantsElement(parentElement) {

    let participantDiv1 = createHTMLElement(parentElement, "div", "participantDiv");
    createButtonElement(participantDiv1, "Hide", "toggleParticipantsButton", function() {
        displayParticipants(false);
    });
}

function handleParticipant(participant) {

    let participantInformation = document.getElementById("participantInformation");
    $("html, body").animate({ scrollTop: participantInformation.offsetTop }, "slow");

    chat.handleDisplayedParticipant(participant);
    displayParticipants(chat.isShowAll());
    displayParticipantsInformation();
}

function getUniqueWords(allWords) {

    let uniqueWords = [];

    for (let word of allWords) {
        if (!uniqueWords.includes(word)) {
            uniqueWords.push(word);
        }
    }
    return uniqueWords;
}

function getCommonNumberOfWordsWritten(participantsArray) {

    let lowestNumberOfWords;

    if(participantsArray.length > 0) {
        lowestNumberOfWords = participantsArray[0].getAllWords().length;
    } else {
        lowestNumberOfWords = 0;
    }

    for (let participant of participantsArray) {
        let numberOfWords = participant.getAllWords().length;

        if (numberOfWords < lowestNumberOfWords) {
            lowestNumberOfWords = numberOfWords;
        }
    }
    return lowestNumberOfWords;
}