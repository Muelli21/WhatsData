function parseUserInput() {
    let input1Textarea = document.getElementById("input1");
    let input2Textarea = document.getElementById("input2");

    let input1 = input1Textarea.value;
    let input2 = input2Textarea.value;

    let alignment = compare(input1, input2);
    console.log(alignment);
}

function compare(input1, input2) {

    let sequence1 = cleanRNASequence(input1);
    let sequence2 = cleanRNASequence(input2);

    //let needlemanWunsch = new NeedlemanWunsch();
    //let needlemanAlignment = needlemanWunsch.align(sequence1, sequence2);

    //let alignmentAlgorithm = new AlignmentAlgorithmm();
    //let alignment = alignmentAlgorithm.align(sequence1, sequence2);

    let hirschbergsAlgorithm = new HirschbergsAlgorithm();
    let hirschbergAlignment = hirschbergsAlgorithm.align(sequence1, sequence2);

    showResults(hirschbergAlignment);
    return hirschbergAlignment;
}

function showResults(alignment) {

    let results = document.getElementById("results");
    clearElement(results);
    createHeadline(results, "Results: ", "h2", "resultsHeadline");

    let alignedStringA = alignment.getAlignedStringA();
    let alignedStringB = alignment.getAlignedStringB();
    let lengthA = alignedStringA.length;
    let lengthB = alignedStringB.length;

    if (lengthA == 0 && lengthB == 0) {
        createTextElement(results, "Both inputs are empty! Please provide two input strings.", "resultsText");
        return;
    }

    let percentageDiv = createHTMLElement(results, "div", "resultsDiv");
    createTextElement(percentageDiv, "Percentage: " + (alignment.getPercentage() * 100) + "%", "resultsText");
    createHeadline(results, "Aligned strings", "h3", "resultsHeadline");

    let alignmentString = "";
    for (let index = 0; index < lengthA; index++) {
        let characterA = alignedStringA[index];
        let characterB = alignedStringB[index];

        if (characterA == "-" || characterB == "-") {
            alignmentString = alignmentString + "|";
        }

        else if (characterA == characterB) {
            alignmentString = alignmentString + "=";
        }

        else {
            alignmentString = alignmentString + "≠";
        }
    }

    let stringsContainer = createHTMLElement(results, "div", "resultsContainer");
    createTextElement(stringsContainer, alignedStringA, "alignedString");
    stringsContainer.appendChild(document.createElement("br"));
    createTextElement(stringsContainer, alignmentString, "alignedString");
    stringsContainer.appendChild(document.createElement("br"));
    createTextElement(stringsContainer, alignedStringB, "alignedString");

    toggleDisplayVisibility(results, true);
}

function cleanRNASequence(sequence) {
    let regExpressionNumbers = /([0-9])/g;
    let regExpressionWhitespaces = /\s+/g;

    let cleanSequence = sequence.replace(regExpressionNumbers, "");
    cleanSequence = cleanSequence.replace(regExpressionWhitespaces, "");

    console.log(cleanSequence);
    return cleanSequence;
}