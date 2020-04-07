class HirschbergsAlgorithm {
    constructor() {
        this.needlemanWunsch = new NeedlemanWunsch();
        this.matches = 0;
        this.mismatchPenalty = -1;
    }

    align(sequenceA, sequenceB) {
        let hirschbergsAlignment = this.alignSubsequence(sequenceA, sequenceB);
        let alignment = new Alignment(hirschbergsAlignment[0], hirschbergsAlignment[1], this.matches);
        return alignment;
    }

    alignSubsequence(sequenceA, sequenceB) {

        let alignedA = "";
        let alignedB = "";

        let lengthA = sequenceA.length;
        let lengthB = sequenceB.length;

        if (sequenceA == sequenceB) {
            alignedA = alignedA + sequenceA;
            alignedB = alignedB + sequenceB;
            this.matches = this.matches + sequenceA.length;
        }

        else if (lengthA == 0) {
            for (let columnIndex = 1; columnIndex < lengthB; columnIndex++) {
                alignedA = alignedA + "-";
                alignedB = alignedB + sequenceB[columnIndex - 1];
            }
        }

        else if (lengthB == 0) {
            for (let rowIndex = 1; rowIndex < lengthA; rowIndex++) {
                alignedA = alignedA + sequenceA[rowIndex - 1];
                alignedB = alignedB + "-";
            }
        }

        else if (lengthA == 1 || lengthB == 1) {
            let needlemanAlignment = this.needlemanWunsch.align(sequenceA, sequenceB);
            alignedA = needlemanAlignment.getAlignedStringA();
            alignedB = needlemanAlignment.getAlignedStringB();
            let matches = needlemanAlignment.getMatches();
            this.matches = this.matches + matches;
        }

        else {

            let midIndexA = Math.floor(lengthA / 2);

            //Create initial matrix
            let leftSequence = sequenceA.slice(0, midIndexA);
            let rightSequence = sequenceA.slice(midIndexA, lengthA);

            let leftScore = this.calculateScore(leftSequence, sequenceB);
            let rightScore = this.calculateScore(rightSequence.reverse(), sequenceB.reverse()).reverse();

            let totalScore = [];
            for (let index = 0; index < leftScore.length; index++) {
                totalScore.push(leftScore[index] + rightScore[index]);
            }

            let midIndexB = totalScore.indexOf(Math.max(...totalScore));

            //Apply method recursively

            let alignedLeft = this.alignSubsequence(sequenceA.slice(0, midIndexA), sequenceB.slice(0, midIndexB));
            let alignedRight = this.alignSubsequence(sequenceA.slice(midIndexA, lengthA), sequenceB.slice(midIndexB, lengthB));

            //Code for calculating the alignment with needleman wunsch
            //let alignedLeft = this.needlemanWunsch.align(sequenceA.slice(0, midIndexA), sequenceB.slice(0, midIndexB));
            //let alignedRight = this.needlemanWunsch.align(sequenceA.slice(midIndexA, lengthA), sequenceB.slice(midIndexB, lengthB));
            //let matches = alignedLeft[2] + alignedRight[2];
            //this.matches = this.matches + matches;

            let alignedALeft = alignedLeft[0];
            let alignedBLeft = alignedLeft[1];

            let alignedARight = alignedRight[0];
            let alignedBRight = alignedRight[1];

            alignedA = alignedALeft + alignedARight;
            alignedB = alignedBLeft + alignedBRight;
        }

        return [
            alignedA, 
            alignedB
        ];
    }

    calculateScore(sequenceA, sequenceB) {

        let lengthA = sequenceA.length;
        let lengthB = sequenceB.length;
        let matrix = new Matrix(2, lengthB + 1).getMatrix();
        let mismatchPenalty = this.mismatchPenalty;

        for (let columnIndex = 1; columnIndex <= lengthB; columnIndex++) {
            matrix[0][columnIndex] = matrix[0][columnIndex - 1] + mismatchPenalty;
        }

        for (let rowIndex = 1; rowIndex <= lengthA; rowIndex++) {

            matrix[1][0] = matrix[0][0] + mismatchPenalty;

            for (let columnIndex = 1; columnIndex <= lengthB; columnIndex++) {
                let match = matrix[0][columnIndex - 1] + this.similarityFactor(rowIndex, columnIndex, sequenceA, sequenceB);
                let deletion = matrix[0][columnIndex] + mismatchPenalty;
                let insertion = matrix[1][columnIndex - 1] + mismatchPenalty;
                matrix[1][columnIndex] = Math.max(match, deletion, insertion);
            }

            matrix[0] = matrix[1];
            matrix[1] = Array(lengthB + 1).fill(0);
        }

        return matrix[0];
    }

    similarityFactor(indexA, indexB, sequenceA, sequenceB) {
        let characterA = sequenceA[indexA - 1];
        let characterB = sequenceB[indexB - 1];
        let similarityFactor = (characterA === characterB) ? 1 : -1;
        return similarityFactor;
    }
}