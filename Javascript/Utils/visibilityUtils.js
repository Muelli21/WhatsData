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