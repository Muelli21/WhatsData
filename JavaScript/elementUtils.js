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