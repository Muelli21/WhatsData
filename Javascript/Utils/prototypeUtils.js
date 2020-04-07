function reverseString(str) {
    let reversed = "";
    for (let char of str) {
        reversed = char + reversed;
    }
    return reversed;
}

function reverseString(str) {
    return [...str].reverse().join('');
}

String.prototype.reverse = function () {
    return [...this].reverse().join('');
}