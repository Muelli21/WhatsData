class AlignmentAlgorithmm {
    constructor() {
        this.mismatchPenalty = -1;
        this.matches = 0;
        this.pivotColumnIndex = 0;
        this.sequenceA;
        this.sequenceB;
        this.alignedStringA;
        this.alignedStringB;
    }

    align(sequenceA, sequenceB) {
        this.sequenceA = sequenceA;
        this.sequenceB = sequenceB;
        this.alignedStringA = "";
        this.alignedStringB = "";
        this.pivotColumnIndex = 0;

        this.alignment = this.calculateAlignment();
        return this.alignment;
    }

    calculateAlignment() {

        let lengthA = this.sequenceA.length;
        let lengthB = this.sequenceB.length;

        let matrixObject = new Matrix(2, lengthA + 1);
        let matrix = matrixObject.getMatrix();

        for (let columnIndex = 1; columnIndex <= lengthB; columnIndex++) {
            matrix[0][columnIndex] = matrix[0][columnIndex - 1] + this.mismatchPenalty;
        }

        for (let rowIndex = 1; rowIndex <= lengthB; rowIndex++) {
            matrix[1][0] = matrix[0][0] + this.mismatchPenalty;

            for (let columnIndex = 1; columnIndex <= lengthB; columnIndex++) {
                let match = matrix[0][columnIndex - 1] + this.similarityFactor(rowIndex, columnIndex, this.sequenceA, this.sequenceB);
                let deletion = matrix[0][columnIndex] + this.mismatchPenalty;
                let insertion = matrix[1][columnIndex - 1] + this.mismatchPenalty;
                matrix[1][columnIndex] = Math.max(match, deletion, insertion);
            }

            this.evaluatePath(rowIndex, matrix);
            matrix[0] = matrix[1];
            matrix[1] = Array(lengthB + 1).fill(0);
        }

        return [
            this.alignedStringA,
            this.alignedStringB,
            this.matches,
            this.matches / lengthA
        ];
    }

    evaluatePath(rowIndex, matrix) {

        let lengthA = this.sequenceA.length;
        let lengthB = this.sequenceB.length;

        if (rowIndex == lengthB && this.pivotColumnIndex != lengthA - 1) {
            this.pivotColumnIndex++;
            this.deletion(this.pivotColumnIndex);
            this.evaluatePath(rowIndex, matrix);
            return;
        }

        if (this.pivotColumnIndex == lengthA && rowIndex != lengthB - 1) {
            this.insertion(rowIndex);
            return;
        }

        let matchScore = matrix[1][this.pivotColumnIndex + 1];
        let deletionScore = matrix[0][this.pivotColumnIndex + 1];
        let insertionScore = matrix[1][this.pivotColumnIndex];

        let isMatch = matchScore >= insertionScore && matchScore >= deletionScore;
        let isDeletion = deletionScore >= matchScore && deletionScore >= insertionScore;

        if (isMatch) {
            this.match(rowIndex, this.pivotColumnIndex + 1);
            this.pivotColumnIndex++;
        } else if (isDeletion) {
            this.deletion(this.pivotColumnIndex);
            this.pivotColumnIndex++;
            this.evaluatePath(rowIndex, matrix);
        } else {
            this.insertion(rowIndex);
        }
    }

    similarityFactor(indexA, indexB) {
        let characterA = this.sequenceA[indexA - 1];
        let characterB = this.sequenceB[indexB - 1];
        let similarityFactor = (characterA === characterB) ? 1 : -1;
        return similarityFactor;
    }

    match(rowIndex, columnIndex) {
        this.alignedStringA = this.alignedStringA + this.sequenceA[columnIndex - 1];
        this.alignedStringB = this.alignedStringB + this.sequenceB[rowIndex - 1];
        this.matches = this.sequenceA[columnIndex - 1] == this.sequenceB[rowIndex - 1] ? this.matches + 1 : this.matches;
    }

    deletion(columnIndex) {
        this.alignedStringA = this.alignedStringA + this.sequenceA[columnIndex - 1];
        this.alignedStringB = this.alignedStringB + "-";
    }

    insertion(rowIndex) {
        this.alignedStringA = this.alignedStringA + "-";
        this.alignedStringB = this.alignedStringB + this.sequenceB[rowIndex - 1];
    }
}