// As you can see in the following examples, different patterns have to be recognized in order to split the lines correctly. 
// This inconvenience is caused by the inability of the WhatsApp-developers to format dates correctly and uniformly on all operation systems


// 3/17/19, 01:44 - Anne: I will be there at 6 o'clock
// 23.09.18, 21:14 - Martha: nothing
// [29.07.18, 13:06:21] Mike: What's going on?
// [20/07/2019, 17:13:32] Peter: I will be there in a few seconds

// 3/17/19 Android english
// 25.07.18 Android german
// 23.09.18 IOS german
// 20/07/2019 IOS english

function getAmountOfLetters(arrayOfWords) {
    let amount = 0;

    for (let word of arrayOfWords) {
        for (let letter of word) {
            amount++;
        }
    }

    return amount;
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

    mostUsedWords = words.sort(function (a, b) {
        return mapOfCountedWords[b] - mapOfCountedWords[a];
    });

    if (mostUsedWords.length > amountOfWords) {
        mostUsedWords = mostUsedWords.slice(0, amountOfWords);
    }

    for (key of mostUsedWords) {
        let count = mapOfCountedWords[key];
        mostUsedWordsCount.push(count);
    }

    return [mostUsedWords, mostUsedWordsCount, owner];
}

function getDateStreak(dates, type) {

    let previousDate = dates[0] || new Date();
    let currentStreak = 0;
    let currentStreakStartIndex = 0;
    let streaks = [];

    for (i = 0; i < dates.length; i++) {

        let currentDate = dates[i];
        let calculatedDate = new Date(currentDate);
        calculatedDate.setDate(currentDate.getDate() - 1);

        if (isTheSameDate(previousDate, calculatedDate)) {
            currentStreak++;

        } else {

            if (currentStreak >= 1) {
                let startDate = dates[currentStreakStartIndex];
                let endDate = dates[currentStreakStartIndex + currentStreak];
                streaks.push(new Streak(startDate, endDate, currentStreak, type));
            }

            currentStreak = 0;
            currentStreakStartIndex = i;
        }

        if (i == dates.length - 1 && currentStreak >= 1) {
            let startDate = dates[currentStreakStartIndex];
            let endDate = dates[currentStreakStartIndex + currentStreak];
            streaks.push(new Streak(startDate, endDate, currentStreak, type));
        }

        previousDate = currentDate;
    }

    streaks = streaks.sort(function (a, b) {
        return b.getStreakLength() - a.getStreakLength();
    });

    let MAX_LENGTH = 7;

    if (streaks.length >= MAX_LENGTH) {
        streaks = streaks.slice(0, MAX_LENGTH + 1);
    }

    return [streaks, type];
}

function getPeakHours(allMessages, origin) {

    let messagesPerHour = {};
    let peakHour = null;

    for (i = 0; i <= 23; i++) {
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

function getPeakDays(allMessages, origin) {

    let messagesPerDay = {};
    let peakDay = null;

    for (i = 0; i <= 6; i++) {
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

    let dateEntries = {};
    let startDate = allMessages[0].getDate() || new Date();
    let endDate = allMessages[allMessages.length - 1].getDate() || new Date();

    let allDates = getDatesInbetween(startDate, endDate);

    for (let date of allDates) {
        dateEntries[date.getTime()] = new DateEntry(date);
    }

    for (let message of allMessages) {
        let date = message.getDate().withoutTime();
        let dateEntry = dateEntries[date.getTime()];
        dateEntry.addMessage(message);
        dateEntry.addParticipant(message.getParticipant());
    }

    return [dateEntries, owner];
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

function getMostActiveDay(dateEntries) {

    let mostActiveDay;
    let messagesAtTheDay = [];
    let dates = Object.keys(dateEntries);


    for (let date of dates) {
        let dateEntry = dateEntries[date];
        let messages = dateEntry.getMessages();

        if (messages.length > messagesAtTheDay.length) {
            mostActiveDay = date;
            messagesAtTheDay = messages;
        }
    }

    let date = new Date();
    date.setTime(mostActiveDay);

    return [date, messagesAtTheDay];
}

function handleParticipant(participant) {

    let participantInformation = document.getElementById("participantInformation");

    chat.handleDisplayedParticipant(participant);
    displayParticipants(chat.isShowAll());
    displayParticipantsInformation();

    $("html, body").animate({ scrollTop: participantInformation.offsetTop }, "slow");
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

    if (participantsArray.length > 0) {
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