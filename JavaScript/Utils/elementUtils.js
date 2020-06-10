function createHTMLElement(parentElement, type, className) {
    let element = document.createElement(type);
    element.className = className;
    parentElement.appendChild(element);
    return element;
}

function createTextElement(parentElement, text, className) {
    let element = document.createElement("p");
    let elementText = document.createTextNode(text);
    element.className = className;
    element.appendChild(elementText);
    parentElement.appendChild(element);
    return element;
}

function updateTextElement(element, text) {
    clearElement(element);
    let elementText = document.createTextNode(text);
    element.appendChild(elementText);
}

function createHeadline(parentElement, text, type, className) {

    if (type != "h1" || type != "h2" || type != "h3" || type != "h4") {
        type = "h1";
    }

    let element = document.createElement(type);
    let elementText = document.createTextNode(text);
    element.className = className;
    element.appendChild(elementText);
    parentElement.appendChild(element);
    return element;
}

function createLinkElement(parentElement, childElement, title, href, className) {
    let element = document.createElement("a");
    element.className = className;
    element.appendChild(childElement);
    element.title = title;
    element.href = href;
    parentElement.appendChild(element);
    return element;
}

function createButtonElement(parentElement, text, className, functionToExecute) {
    let element = document.createElement("input");
    element.type = "button";
    element.value = text;
    element.className = className + "Hidden";
    element.id = text + "Hidden";
    element.onclick = functionToExecute;
    parentElement.appendChild(element);

    let label = document.createElement("label");
    label.htmlFor = element.id;
    label.className = className;
    parentElement.appendChild(label);
    element.style.display = "none";
    let textElement = createTextElement(label, text, className + "Text");

    return [element, label, textElement];
}

function createButtonElementWithoutFunction(parentElement, text, className) {
    let element = document.createElement("input");
    element.type = "button";
    element.value = text;
    element.className = className + "Hidden";
    element.id = text + "Hidden";
    parentElement.appendChild(element);

    let label = document.createElement("label");
    label.htmlFor = element.id;
    label.className = className;
    parentElement.appendChild(label);
    element.style.display = "none";
    let textElement = createTextElement(label, text, className + "Text");

    return [element, label, textElement];
}

function createButtonElementWithoutFunction(parentElement, text, className) {
    let element = document.createElement("input");
    element.type = "button";
    element.value = text;
    element.className = className + "Hidden";
    element.id = className + "Hidden";
    parentElement.appendChild(element);

    let label = document.createElement("label");
    label.htmlFor = element.id;
    label.className = className;
    parentElement.appendChild(label);
    element.style.display = "none";
    let textElement = createTextElement(label, text, className + "Text");

    return [element, label, textElement];
}

function infoBoxElement(parentElement, fact, descriptionArray) {

    let div = createHTMLElement(parentElement, "div", "infoBoxDiv");
    createHeadline(div, fact, "h2", "infoBoxFact");

    for (let description of descriptionArray) {
        createTextElement(div, description, "infoBoxDescription");
    }
    return div;
}

function participantsElement(participant, parentElement) {

    let participantDiv1 = createHTMLElement(parentElement, "div", "participantDiv");
    let button = createButtonElement(participantDiv1, participant.getName(), "participantButton", (function (variable) {
        return function () {
            handleParticipant(variable);
        };
    })(participant));

    let labelElement = button[2];
    if (participant.isDisplayed()) {
        labelElement.classList.add("displayedParticipantButton");
    }
}

function streakElement(chatStreak, description) {

    let streaksDiv = document.getElementById("infoBoxesStreaks");
    let streaks = chatStreak[0];

    if (streaks.length == 0) {
        infoBoxElement(streaksDiv, "There is no such streak!", ["zero days", description]);
        return;
    }

    let globalStreak = streaks[0];

    let fact = globalStreak.getStreakLength() + " day " + globalStreak.getType();
    let dates = "From " + globalStreak.getStartDate().getMonthDayYearString() + " to " + globalStreak.getEndDate().getMonthDayYearString();
    let descriptionArray = [dates, description];
    infoBoxElement(streaksDiv, fact, descriptionArray);
}

function clearElement(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

function clearAllSections() {

    let elementsToClear = document.querySelectorAll('.toClear');
    for (let element of elementsToClear) {
        clearElement(element);
    }
    clearParticipantsSection();
    clearParticipantsButtonsSection();
}

function clearParticipantsSection() {

    let elementsToClear = document.querySelectorAll('.toClearParticipants');
    for (let element of elementsToClear) {
        clearElement(element);
    }
}

function clearParticipantsButtonsSection() {

    let elementsToClear = document.querySelectorAll('.toClearParticipantsButtons');
    for (let element of elementsToClear) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
    }
}