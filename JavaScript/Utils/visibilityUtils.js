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
        for (let childElement of element.childNodes) {
            let height = childElement.offsetHeight;

            if (!isNaN(height)) {
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

function toggleSection(element) {
    let visible = true;

    if (element.style.height == "0px" || element.style.height == 0) {
        visible = false;
    }

    toggleVisibilityUsingHeight(element, !visible);
}

function showAllParticipantsElement(parentElement) {

    let participantDiv1 = createHTMLElement(parentElement, "div", "participantDiv");
    createButtonElement(participantDiv1, "Show all", "toggleParticipantsButton", function () {
        displayParticipants(true);
    });
}

function hideAllParticipantsElement(parentElement) {

    let participantDiv1 = createHTMLElement(parentElement, "div", "participantDiv");
    createButtonElement(participantDiv1, "Hide", "toggleParticipantsButton", function () {
        displayParticipants(false);
    });
}

function toggleAdvancedStreakSection(textElement) {

    let element = document.getElementById("streakChart");
    clearElement(element);

    if (!chat.isShowingStreakCharts()) {
        createStreakChart(chat.getChatStreak(), document.getElementById("streakChart"));
        createStreakChart(chat.getNoMessageStreak(), document.getElementById("streakChart"));
        createStreakChart(chat.getIgnoredStreak(), document.getElementById("streakChart"));

        updateTextElement(textElement, "Hide");
        chat.setShowingStreakCharts(true);
    } else {
        updateTextElement(textElement, "Show more");
        chat.setShowingStreakCharts(false);
    }
}

function toggleAboutSection() {
    let section = document.getElementById("about");
    toggleSection(section);
}