class Alignment {
    constructor(alignedStringA, alignedStringB, matches) {

        let regExpression = /(\r\n|\n|\r)/gm;
        this.alignedStringA = alignedStringA.replace(regExpression, "");
        this.alignedStringB = alignedStringB.replace(regExpression, "");
        this.matches = matches;
        this.percentage = this.matches / this.alignedStringA.length;
    }

    getAlignedStringA() {
        return this.alignedStringA;
    }

    getAlignedStringB() {
        return this.alignedStringB;
    }

    getMatches() {
        return this.matches;
    }

    getPercentage() {
        return this.percentage;
    }
}